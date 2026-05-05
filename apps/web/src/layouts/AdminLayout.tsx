import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/admin/Sidebar";
import { Topbar } from "../components/admin/Topbar";

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <section className="admin-content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
