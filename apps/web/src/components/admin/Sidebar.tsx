import { FileText, Home, Inbox, LogOut, Newspaper, PanelLeftClose, PanelLeftOpen, Settings, Users, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const links = [
  ["/admin", "Dashboard", Home],
  ["/admin/posts", "Blog", FileText],
  ["/admin/news", "Noticias", Newspaper],
  ["/admin/resources", "Recursos", FileText],
  ["/admin/services", "Servicios", Wrench],
  ["/admin/inquiries", "Consultas", Inbox],
  ["/admin/settings", "Ajustes", Settings],
  ["/admin/users", "Usuarios", Users]
] as const;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("admin-sidebar-collapsed") === "true");
  const { logout } = useAuth();

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <aside className={collapsed ? "admin-sidebar collapsed" : "admin-sidebar"}>
      <button className="icon-btn" onClick={() => setCollapsed((value) => !value)} aria-label="Plegar sidebar">
        {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
      </button>
      <nav>
        {links.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === "/admin"}>
            <Icon size={18} /> <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-logout" onClick={() => logout()}>
        <LogOut size={18} /> <span>Salir</span>
      </button>
    </aside>
  );
}
