import { FileText, GraduationCap, Globe, LogOut, MessageCircle, PanelLeftClose, PanelLeftOpen, Tag, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const contentLinks = [
  ["/admin/posts", "Blog", FileText],
  ["/admin/training", "Formación", GraduationCap],
  ["/admin/chat", "Chat", MessageCircle]
] as const;

const webLinks = [
  ["/admin/services", "Servicios", Wrench],
  ["/admin/categories", "Categorías blog", Tag]
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
        {!collapsed && <span className="sidebar-section-label"><Globe size={12} /> Contenido</span>}
        {contentLinks.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} data-tour={`admin-sidebar-${to.split("/").pop() || "dashboard"}`}>
            <Icon size={18} /> <span>{label}</span>
          </NavLink>
        ))}
        {!collapsed && <span className="sidebar-section-label"><Wrench size={12} /> Gestión web</span>}
        {webLinks.map(([to, label, Icon]) => (
          <NavLink key={to} to={to}>
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
