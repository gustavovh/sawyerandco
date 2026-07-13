import React from "react";
import { useNavigate } from "react-router-dom";

// AuthCallback page removed - admin authentication no longer needed for calculator-only app
export default function AuthCallback() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-slate-600">Redirecting...</p>
      </div>
    </div>
  );
}
