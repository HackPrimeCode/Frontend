import type { GlobalRole } from "@/features/auth/model/authTypes";
import ForbiddenPage from "@/pages/ForbiddenPage";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";

export default function RoleProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: GlobalRole[];
}) {
  const user = useSelector((state: RootState) => state.auth.user);
  return user && allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <ForbiddenPage />
  );
}
