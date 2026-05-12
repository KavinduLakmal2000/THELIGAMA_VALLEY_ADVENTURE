import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authApi, getToken, removeToken } from "./api/client";

/**
 * Verifies the stored JWT against the server on every mount.
 * Shows a loading screen while checking, then either renders
 * children or redirects to /admin/login.
 */
export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking"); // "checking" | "ok" | "fail"

  useEffect(() => {
    if (!getToken()) { setStatus("fail"); return; }

    authApi.me()
      .then(() => setStatus("ok"))
      .catch(() => { removeToken(); setStatus("fail"); });
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-8 h-8 text-cyan-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-stone-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Verifying session...</p>
        </div>
      </div>
    );
  }

  if (status === "fail") return <Navigate to="/admin/login" replace />;

  return children;
}
