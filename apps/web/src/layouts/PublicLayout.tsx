import { Outlet } from "react-router-dom";
import { PublicFooter } from "../components/public/PublicFooter";
import { PublicNavbar } from "../components/public/PublicNavbar";

export function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <main className="public-main">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}
