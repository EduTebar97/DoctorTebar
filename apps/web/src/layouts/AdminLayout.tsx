import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/admin/Sidebar";
import { Topbar } from "../components/admin/Topbar";
import { GuidedTourProvider } from "../components/guides/GuidedTourProvider";
import { TourHelpButton } from "../components/guides/TourHelpButton";

export function AdminLayout() {
  return (
    <GuidedTourProvider>
      <div className="admin-shell" data-tour="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <Topbar />
          <section className="admin-content">
            <TourHelpButton guideIds={["admin-overview", "create-blog-post", "manage-inquiries", "media-library", "users-roles"]} />
            <Outlet />
          </section>
        </div>
      </div>
    </GuidedTourProvider>
  );
}
