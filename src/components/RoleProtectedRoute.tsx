import type { GlobalRole } from "@/features/auth/model/authTypes";
import ForbiddenPage from "@/pages/ForbiddenPage";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";

interface RoleProtectedRouteProps {
  allowedRoles?: GlobalRole[];
}

export default function RoleProtectedRoute({
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return <ForbiddenPage />;

  const isAllowed = allowedRoles.includes(user.global_role);

  return isAllowed ? <Outlet /> : <ForbiddenPage />;
}
