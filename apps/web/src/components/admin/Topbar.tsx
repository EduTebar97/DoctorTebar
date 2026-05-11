import { useAuth } from "../../hooks/useAuth";

export function Topbar() {
  const { user } = useAuth();
  return (
    <header className="admin-topbar" data-tour="admin-topbar">
      <strong>Panel privado</strong>
      <span>{user?.name ?? "Administrador"}</span>
    </header>
  );
}
