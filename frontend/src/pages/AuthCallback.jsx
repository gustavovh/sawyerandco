import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export default function AuthCallback() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash || "";
    const match = hash.match(/session_id=([^&]+)/);
    if (!match) {
      navigate("/admin", { replace: true });
      return;
    }
    const sessionId = match[1];

    (async () => {
      try {
        const { data } = await api.post("/auth/session", null, {
          headers: { "X-Session-ID": sessionId },
        });
        // Clear hash and navigate to admin
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/admin", { replace: true, state: { user: data } });
      } catch (e) {
        navigate("/admin/login", { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center" data-testid="auth-callback-loading">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-slate-600 font-medium">Signing you in…</p>
      </div>
    </div>
  );
}
