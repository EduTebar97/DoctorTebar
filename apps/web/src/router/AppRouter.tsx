import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { LoginPage } from "../pages/admin/LoginPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminAuditPage } from "../pages/admin/AdminAuditPage";
import { AdminCalendarPage } from "../pages/admin/AdminCalendarPage";
import { AdminEditorialPage } from "../pages/admin/AdminEditorialPage";
import { AdminGenericListPage } from "../pages/admin/AdminGenericListPage";
import { AdminGuidesPage } from "../pages/admin/AdminGuidesPage";
import { AdminInquiriesPage } from "../pages/admin/AdminInquiriesPage";
import { AdminMediaPage } from "../pages/admin/AdminMediaPage";
import { AdminPostEditorPage } from "../pages/admin/AdminPostEditorPage";
import { AdminResourceEditorPage } from "../pages/admin/AdminResourceEditorPage";
import { AdminServiceEditorPage } from "../pages/admin/AdminServiceEditorPage";
import { AdminSettingsPage } from "../pages/admin/AdminSettingsPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";
import { AboutPage } from "../pages/public/AboutPage";
import { BlogDetailPage } from "../pages/public/BlogDetailPage";
import { BlogListPage } from "../pages/public/BlogListPage";
import { ContactPage } from "../pages/public/ContactPage";
import { HomePage } from "../pages/public/HomePage";
import { NewsDetailPage } from "../pages/public/NewsDetailPage";
import { NewsListPage } from "../pages/public/NewsListPage";
import { ResourcesPage } from "../pages/public/ResourcesPage";
import { ServicesPage } from "../pages/public/ServicesPage";
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "sobre-mi", element: <AboutPage /> },
      { path: "servicios", element: <ServicesPage /> },
      { path: "blog", element: <BlogListPage /> },
      { path: "blog/:slug", element: <BlogDetailPage /> },
      { path: "noticias", element: <NewsListPage /> },
      { path: "noticias/:slug", element: <NewsDetailPage /> },
      { path: "recursos", element: <ResourcesPage /> },
      { path: "contacto", element: <ContactPage /> }
    ]
  },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/admin",
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "editorial", element: <AdminEditorialPage /> },
      { path: "calendar", element: <AdminCalendarPage /> },
      { path: "posts", element: <AdminGenericListPage path="posts" title="Blog" editBase="/admin/posts" /> },
      { path: "posts/new", element: <AdminPostEditorPage /> },
      { path: "posts/:id/edit", element: <AdminPostEditorPage /> },
      { path: "news", element: <AdminGenericListPage path="news" title="Noticias" editBase="/admin/news" /> },
      { path: "news/new", element: <AdminPostEditorPage type="news" /> },
      { path: "resources", element: <AdminGenericListPage path="resources" title="Recursos" editBase="/admin/resources" /> },
      { path: "resources/new", element: <AdminResourceEditorPage /> },
      { path: "resources/:id/edit", element: <AdminResourceEditorPage /> },
      { path: "services", element: <AdminGenericListPage path="services" title="Servicios" editBase="/admin/services" /> },
      { path: "services/new", element: <AdminServiceEditorPage /> },
      { path: "services/:id/edit", element: <AdminServiceEditorPage /> },
      { path: "media", element: <AdminMediaPage /> },
      { path: "inquiries", element: <AdminInquiriesPage /> },
      { path: "guides", element: <AdminGuidesPage /> },
      { path: "settings", element: <AdminSettingsPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "audit", element: <AdminAuditPage /> }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
