import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./AdminLogin";

/**
 * Wrap any route that requires admin login.
 * Unauthenticated users are redirected to /admin/login.
 *
 * When you add a real backend:
 *   - Replace isAuthenticated() with a check against your JWT / session cookie.
 *   - Optionally add a loading state here while you verify the token with the server.
 */
export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
