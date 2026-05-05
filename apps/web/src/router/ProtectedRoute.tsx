import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
