import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [savingAi, setSavingAi] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiError, setAiError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const canUpdateStatus = ["moderator", "admin"].includes(user?.role || "");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
        const res = await fetch(
          `${serverUrl}/api/tickets/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
          setResolutionNotes(data.ticket?.resolutionNotes || "");
          setAiAnswer(data.ticket?.aiAnswer || "");
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return <div className="text-center mt-10">Loading ticket details...</div>;
  if (!ticket) return <div className="text-center mt-10">Ticket not found</div>;

  const handleStatusUpdate = async (nextStatus) => {
    setUpdating(true);
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
      const res = await fetch(`${serverUrl}/api/tickets/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: nextStatus,
          resolutionNotes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTicket(data.ticket);
      }
    } catch (err) {
    } finally {
      setUpdating(false);
    }
  };

  const handleGenerateAiAnswer = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
      const res = await fetch(`${serverUrl}/api/tickets/${id}/answer-with-ai`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setTicket(data.ticket);
        setAiAnswer(data.ticket?.aiAnswer || "");
      } else {
        setAiError(data?.detail || data?.message || "Failed to generate AI answer");
      }
    } catch (err) {
      setAiError("Network error while generating AI answer");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAiAnswer = async () => {
    setSavingAi(true);
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
      const res = await fetch(`${serverUrl}/api/tickets/${id}/ai-answer`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ aiAnswer }),
      });
      const data = await res.json();
      if (res.ok) {
        setTicket(data.ticket);
        setAiAnswer(data.ticket?.aiAnswer || "");
      }
    } catch (err) {
    } finally {
      setSavingAi(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Ticket</h2>
        <p className="text-sm text-black/60 font-mono">
          {"//"} detail_view
        </p>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-xl p-4 md:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold truncate">{ticket.title}</h3>
            <p className="text-black/70 mt-1 whitespace-pre-line">{ticket.description}</p>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded-full border border-black/10 bg-white">
            {ticket.status || "TODO"}
          </span>
        </div>

        {/* Conditionally render extended details */}
        {ticket.status && (
          <>
            <div className="divider">Metadata</div>
            <p>
              <strong>Status:</strong> {ticket.status}
            </p>

            {canUpdateStatus && (
              <div className="rounded-xl border border-black/10 bg-white p-4 space-y-3">
                <p className="font-semibold">Status actions</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="btn btn-sm btn-outline"
                    disabled={updating || ticket.status === "TODO"}
                    onClick={() => handleStatusUpdate("TODO")}
                  >
                    Mark TODO
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    disabled={updating || ticket.status === "IN_PROGRESS"}
                    onClick={() => handleStatusUpdate("IN_PROGRESS")}
                  >
                    Mark In Progress
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    disabled={updating || ticket.status === "RESOLVED"}
                    onClick={() => handleStatusUpdate("RESOLVED")}
                  >
                    Mark Resolved
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    disabled={updating || ticket.status === "CLOSED"}
                    onClick={() => handleStatusUpdate("CLOSED")}
                  >
                    Mark Closed
                  </button>
                </div>

                <textarea
                  className="textarea textarea-bordered w-full bg-white"
                  placeholder="Optional resolution notes"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
                <button
                  className="btn btn-sm border border-black/10 bg-white hover:bg-black hover:text-white transition"
                  disabled={updating}
                  onClick={() => handleStatusUpdate(ticket.status || "TODO")}
                >
                  Save Resolution Notes
                </button>
              </div>
            )}

            {ticket.priority && (
              <p>
                <strong>Priority:</strong> {ticket.priority}
              </p>
            )}

            {isAdmin && (
              <div className="rounded-xl border border-black/10 bg-white p-4 space-y-3">
                <p className="font-semibold">AI Answer</p>
                <button
                  className="btn btn-sm border border-black/10 bg-white hover:bg-black hover:text-white transition"
                  disabled={aiLoading}
                  onClick={handleGenerateAiAnswer}
                >
                  {aiLoading ? "Generating..." : "Answer with AI"}
                </button>
                <textarea
                  className="textarea textarea-bordered w-full bg-white"
                  placeholder="AI answer will appear here"
                  value={aiAnswer}
                  onChange={(e) => setAiAnswer(e.target.value)}
                />
                {aiError ? <p className="text-sm text-red-600">{aiError}</p> : null}
                <button
                  className="btn btn-sm border border-black/10 bg-white hover:bg-black hover:text-white transition"
                  disabled={savingAi}
                  onClick={handleSaveAiAnswer}
                >
                  {savingAi ? "Saving..." : "Save AI Answer"}
                </button>
              </div>
            )}

            {ticket.aiAnswer && (
              <div>
                <strong>AI Suggested Answer:</strong>
                <p className="mt-1 whitespace-pre-line">{aiAnswer || ticket.aiAnswer}</p>
              </div>
            )}

            {ticket.resolutionNotes && (
              <div>
                <strong>Resolution Notes:</strong>
                <p className="mt-1 whitespace-pre-line">{ticket.resolutionNotes}</p>
              </div>
            )}

            {ticket.relatedSkills?.length > 0 && (
              <p>
                <strong>Related Skills:</strong>{" "}
                {ticket.relatedSkills.join(", ")}
              </p>
            )}

            {ticket.helpfulNotes && (
              <div>
                <strong>Helpful Notes:</strong>
                <div className="prose max-w-none rounded mt-2 bg-white border border-black/10 p-3">
                  <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                </div>
              </div>
            )}

            {ticket.assignedTo && (
              <p>
                <strong>Assigned To:</strong> {ticket.assignedTo?.email}
              </p>
            )}

            {ticket.createdAt && (
              <p className="text-xs text-black/50 font-mono mt-2">
                Created: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}