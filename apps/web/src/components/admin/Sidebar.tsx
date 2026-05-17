import { FileText, GraduationCap, LogOut, MessageCircle, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const links = [
  ["/admin/posts", "Blog", FileText],
  ["/admin/training", "Formacion", GraduationCap],
  ["/admin/chat", "Chat", MessageCircle]
] as const;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("admin-sidebar-collapsed") === "true");
  const { logout } = useAuth();

  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <aside className={collapsed ? "admin-sidebar collapsed" : "admin-sidebar"} data-tour="admin-sidebar">
      <button className="icon-btn" onClick={() => setCollapsed((value) => !value)} aria-label="Plegar sidebar">
        {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
      </button>
      <nav>
        {links.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} data-tour={`admin-sidebar-${to.split("/").pop() || "dashboard"}`}>
            <Icon size={18} /> <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-logout" onClick={() => { void logout().catch(() => console.warn("[AUTH] Error controlado cerrando sesion")); }}>
        <LogOut size={18} /> <span>Salir</span>
      </button>
    </aside>
  );
}
