import { LogIn, UserPlus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";

type Tab = "login" | "register";

export function PublicAuthPage() {
  const { user, login, register, loginError, registerError } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") ?? "/";

  const [tab, setTab] = useState<Tab>(params.get("tab") === "register" ? "register" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  if (user) return <Navigate to={redirect} replace />;

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    try {
      await login({ email, password });
      navigate(redirect, { replace: true });
    } catch {
      // loginError handled below
    }
  }

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (password !== password2) {
      setLocalError("Las contraseñas no coinciden");
      return;
    }
    try {
      await register({ name, email, password });
      navigate(redirect, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg?.toLowerCase().includes("registrado")) setLocalError("Este email ya está registrado. Inicia sesión.");
    }
  }

  return (
    <section className="public-auth-page">
      <div className="public-auth-box">
        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === "login" ? " active" : ""}`}
            onClick={() => { setTab("login"); setLocalError(null); }}
            type="button"
          >
            <LogIn size={16} /> Iniciar sesión
          </button>
          <button
            className={`auth-tab${tab === "register" ? " active" : ""}`}
            onClick={() => { setTab("register"); setLocalError(null); }}
            type="button"
          >
            <UserPlus size={16} /> Crear cuenta
          </button>
        </div>

        {tab === "login" ? (
          <form className="auth-form" onSubmit={onLogin}>
            <p className="auth-intro">Accede a los contenidos de formación y al chat con el Dr. Tebar.</p>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
            <label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
            <ErrorMessage message={localError ?? (loginError ? "Credenciales no válidas" : undefined)} />
            <Button type="submit"><LogIn size={18} /> Entrar</Button>
            <p className="auth-switch">
              ¿No tienes cuenta?{" "}
              <button type="button" className="link-btn" onClick={() => { setTab("register"); setLocalError(null); }}>
                Regístrate gratis
              </button>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={onRegister}>
            <p className="auth-intro">Crea tu cuenta gratuita para acceder a los contenidos y participar en el chat.</p>
            <label>Nombre completo<input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" /></label>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
            <label>Contraseña (mín. 8 caracteres)<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" /></label>
            <label>Confirmar contraseña<input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required autoComplete="new-password" /></label>
            <ErrorMessage message={localError ?? (registerError ? "No se pudo crear la cuenta. Inténtalo de nuevo." : undefined)} />
            <Button type="submit"><UserPlus size={18} /> Crear cuenta</Button>
            <p className="auth-switch">
              ¿Ya tienes cuenta?{" "}
              <button type="button" className="link-btn" onClick={() => { setTab("login"); setLocalError(null); }}>
                Inicia sesión
              </button>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
