import { LogIn } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";

export function LoginPage() {
  const { user, login, loginError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  if (user) return <Navigate to="/admin" replace />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await login({ email, password });
    navigate("/admin");
  }

  return (
    <main className="login-page">
      <form className="login-box" onSubmit={onSubmit}>
        <h1>Acceso privado</h1>
        <label>Email<input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <ErrorMessage message={loginError ? "Credenciales no validas" : undefined} />
        <Button type="submit"><LogIn size={18} /> Entrar</Button>
      </form>
    </main>
  );
}
