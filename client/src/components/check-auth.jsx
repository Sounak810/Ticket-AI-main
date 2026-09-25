import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

function CheckAuth({ children, protected: protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

    const run = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/users/user`, {
          credentials: "include",
        });
        const isAuthed = res.ok;
        if (isAuthed) {
          const user = await res.json();
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }

        if (protectedRoute) {
          if (!isAuthed) navigate("/login");
          else setLoading(false);
        } else {
          if (isAuthed) navigate("/");
          else setLoading(false);
        }
      } catch {
        localStorage.removeItem("user");
        if (protectedRoute) navigate("/login");
        else setLoading(false);
      }
    };

    run();
  }, [navigate, protectedRoute]);

  if (loading) {
    return <LoadingSpinner />;
  }
  return children;
}

export default CheckAuth;