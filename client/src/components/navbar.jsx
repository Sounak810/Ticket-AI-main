import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, [location.pathname]);

  const logout = async () => {
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
      await fetch(`${serverUrl}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };
  return (
    <div className="sticky top-0 z-10 border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between gap-3 h-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono tracking-tight select-none"
          >
            <span
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-black/10 bg-black text-white text-sm"
              style={{ boxShadow: "0 0 0 3px rgba(0,255,160,0.10)" }}
            >
              TA
            </span>
            <span className="text-black text-lg">Ticket</span>
            <span className="text-black/60 text-lg">AI</span>
          </Link>

          <div className="flex items-center gap-2">
        {!user ? (
          <>
            <Link to="/signup" className="btn btn-sm">
              Signup
            </Link>
            <Link to="/login" className="btn btn-sm">
              Login
            </Link>
          </>
        ) : (
          <>
            <p className="hidden md:block font-mono text-xs text-black/70 max-w-[260px] truncate">
              {user?.email}
            </p>
            {user && user?.role === "admin" ? (
              <Link to="/admin" className="btn btn-sm">
                Admin
              </Link>
            ) : null}
            <button onClick={logout} className="btn btn-sm">
              Logout
            </button>
          </>
        )}
      </div>
        </div>
      </div>
    </div>
  );
}