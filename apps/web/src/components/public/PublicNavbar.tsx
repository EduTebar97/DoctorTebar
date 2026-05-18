import { LogIn, LogOut, Menu, Stethoscope, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const links = [
  ["/", "Inicio"],
  ["/blog", "Blog"],
  ["/formacion", "Formacion"]
];

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const authRedirect = `/acceso?redirect=${encodeURIComponent(location.pathname + location.search)}`;

  return (
    <header className="public-nav">
      <NavLink to="/" className="brand">
        <span className="brand-mark"><Stethoscope size={22} /></span>
        <span className="brand-text">
          <span className="brand-title">Eduardo Tebar Boti</span>
          <span className="brand-sub">Bioestadistica clinica aplicada</span>
        </span>
      </NavLink>
      <button className="icon-btn mobile-only" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "nav-links open" : "nav-links"}>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}>
            {label}
          </NavLink>
        ))}
        {user ? (
          <>
            <span className="nav-user">{user.name.split(" ")[0]}</span>
            <button
              className="nav-links-btn secondary"
              onClick={() => { logout(); setOpen(false); }}
              type="button"
            >
              <LogOut size={15} /> Salir
            </button>
          </>
        ) : (
          <>
            <NavLink className="nav-links-btn secondary" to={authRedirect} onClick={() => setOpen(false)}>
              <LogIn size={15} /> Acceder
            </NavLink>
            <NavLink className="nav-links-btn nav-cta" to={`/acceso?tab=register&redirect=${encodeURIComponent(location.pathname + location.search)}`} onClick={() => setOpen(false)}>
              <UserPlus size={15} /> Registrarse
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
