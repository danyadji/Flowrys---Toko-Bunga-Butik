import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Seo } from "../../components/Seo.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { ToastHost } from "../../components/ui/Toast.jsx";
import { authService } from "../../services/authService.js";
import logo from "../../assets/logo.svg";

// Login admin dengan akun server.
export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [session, setSession] = useState(undefined);
  const from = location.state?.from ?? "/admin";

  useEffect(() => {
    authService.getSession().then(setSession);
  }, []);

  if (session) return <Navigate to={from} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await authService.login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch {
      setError("Email atau kata sandi salah.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Seo title="Login Admin" description="Masuk ke panel admin Flowrys." />
      <main className="mx-auto flex min-h-screen max-w-container items-center justify-center bg-cream-50 px-4 py-12">
        <div className="w-full max-w-md rounded-card bg-white p-6 md:p-8">
          <Link to="/" aria-label="Flowrys, ke toko">
            <img src={logo} alt="" aria-hidden="true" className="h-9 w-auto" />
          </Link>
          <h1 className="mt-4 text-2xl">Login Admin</h1>

          <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
            <Input
              id="login-email"
              label="Email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="login-password"
              label="Kata sandi"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
            />
            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? "Memeriksa..." : "Masuk"}
            </button>
          </form>
        </div>
      </main>
      <ToastHost />
    </>
  );
}
