import nodemailer from "nodemailer";

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  return cachedTransporter;
}

function sanitizeHeaderValue(value) {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

export const sendMail = async (to, subject, text) => {
  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || '"Ticket AI" <noreply@ticket-ai.local>',
      to: sanitizeHeaderValue(to),
      subject: sanitizeHeaderValue(subject),
      text,
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Mail error", error.message);
    throw error;
  }
};