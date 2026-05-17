import { Menu, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  ["/", "Inicio"],
  ["/blog", "Blog"],
  ["/formacion", "Formacion"]
];

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
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
      </nav>
    </header>
  );
}
