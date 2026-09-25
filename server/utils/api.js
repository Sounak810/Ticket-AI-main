import { createAgent, gemini } from "@inngest/agent-kit";

const MAX_AI_CHARS = 60_000;

const analyzeTicket = async (ticket) => {
  const modelCandidates = Array.from(
    new Set(
      [
        process.env.GEMINI_MODEL,
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro-latest",
      ].filter(Boolean)
    )
  );

  const buildPrompt = () => `You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.

Analyze the following support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- answerForUser: A concise, practical answer for the ticket creator with step-by-step guidance.
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
- relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

{
"summary": "Short summary of the ticket",
"priority": "high",
"answerForUser": "Try this first...",
"helpfulNotes": "Here are useful tips...",
"relatedSkills": ["React", "Node.js"]
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`;

  const parseResponse = (response) => {
    const raw =
      response?.output?.[0]?.context ||
      response?.output?.[0]?.content ||
      response?.output_text ||
      "";

    if (typeof raw !== "string") {
      throw new Error("AI response was not text");
    }

    if (raw.length > MAX_AI_CHARS) {
      throw new Error("AI response too large");
    }

    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonString = match ? match[1] : raw.trim();
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("AI response JSON must be an object");
    }
    return parsed;
  };

  const failures = [];

  for (const modelName of modelCandidates) {
    try {
      const supportAgent = createAgent({
        model: gemini({
          model: modelName,
          apiKey: process.env.GEMINI_API_KEY,
        }),
        name: "AI Ticket Triage Assistant",
        system: `You are an expert AI assistant that processes technical support tickets.

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide a direct, user-facing answer to help solve the issue.
4. Provide helpful notes and resource links for human moderators.
5. List relevant technical skills required.

IMPORTANT:
- Respond with only valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object.`,
      });

      const response = await supportAgent.run(buildPrompt());
      return parseResponse(response);
    } catch (e) {
      failures.push(`${modelName}: ${e.message}`);
    }
  }

  throw new Error(`All Gemini models failed. ${failures.join(" | ")}`);
};

export default analyzeTicket;

// system prompt 