import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchTickets = async () => {
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
      const res = await fetch(`${serverUrl}/api/tickets`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setTickets(data || []);
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const completedTickets = tickets.filter((ticket) =>
    ["RESOLVED", "CLOSED"].includes(ticket.status)
  );
  const activeTickets = tickets.filter(
    (ticket) => !["RESOLVED", "CLOSED"].includes(ticket.status)
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
      const res = await fetch(`${serverUrl}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); // Refresh list
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 max-w-5xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Tickets</h2>
          <p className="text-sm text-black/60 font-mono">
            Create, monitor, and resolve issues
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-xl p-4 md:p-6 mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold">Create ticket</h3>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="input input-bordered w-full bg-white"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue…"
            className="textarea textarea-bordered w-full bg-white min-h-28"
            required
          ></textarea>
          <div className="flex items-center gap-3">
            <button
              className="btn border border-black/10 bg-white hover:bg-black hover:text-white transition"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            
          </div>
        </form>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <h2 className="text-xl font-semibold">All tickets</h2>
        {user?.role !== "user" ? (
          <p className="text-xs font-mono text-black/60">
            Active: {activeTickets.length} | Completed: {completedTickets.length}
          </p>
        ) : null}
      </div>
      <div className="grid gap-3">
        {activeTickets.map((ticket) => (
          <Link
            key={ticket._id}
            className="rounded-2xl border border-black/10 bg-white/85 backdrop-blur shadow hover:shadow-lg transition p-4 overflow-hidden"
            to={`/tickets/${ticket._id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-lg truncate">{ticket.title}</h3>
                <p className="text-sm text-black/70 line-clamp-2">{ticket.description}</p>
              </div>
              <span className="shrink-0 text-xs font-mono px-2 py-1 rounded-full border border-black/10 bg-white">
                {ticket.status || "TODO"}
              </span>
            </div>
            <p className="text-xs text-black/50 font-mono mt-3">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </Link>
        ))}
        {activeTickets.length === 0 && <p>No active tickets.</p>}

        {completedTickets.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-6">Completed Tickets</h3>
            {completedTickets.map((ticket) => (
              <Link
                key={ticket._id}
                className="rounded-2xl border border-black/10 bg-white/85 backdrop-blur shadow hover:shadow-lg transition p-4 overflow-hidden"
                to={`/tickets/${ticket._id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg truncate">{ticket.title}</h3>
                    <p className="text-sm text-black/70 line-clamp-2">{ticket.description}</p>
                  </div>
                  <span
                    className="shrink-0 text-xs font-mono px-2 py-1 rounded-full border"
                    style={{
                      borderColor: "rgba(0,255,160,0.35)",
                      boxShadow: "0 0 0 3px rgba(0,255,160,0.08)",
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs text-black/50 font-mono mt-3">
                  Created: {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}