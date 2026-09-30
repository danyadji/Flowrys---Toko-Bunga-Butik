import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService.js";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, user: null });

  useEffect(() => {
    authService.getSession().then((user) => setState({ loading: false, user }));
  }, []);

  if (state.loading) {
    return <p className="p-8 text-center">Memeriksa sesi...</p>;
  }
  if (!state.user) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }
  return children;
}
