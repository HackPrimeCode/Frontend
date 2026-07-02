import type { GlobalRole } from "@/features/auth/model/authTypes";
import ForbiddenPage from "@/pages/ForbiddenPage";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";

interface RoleProtectedRouteProps {
  allowedRoles?: GlobalRole[];
  allowedLocalRoles?: string[];
}

export default function RoleProtectedRoute({
  allowedRoles,
  allowedLocalRoles,
}: RoleProtectedRouteProps) {
  const { user, currentContext } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!user) return <ForbiddenPage />;

  const hasGlobalAccess = allowedRoles
    ? allowedRoles.includes(user.global_role)
    : false;

  const hasLocalAccess =
    allowedLocalRoles && currentContext?.localRole
      ? allowedLocalRoles.includes(currentContext.localRole)
      : false;

  const isAllowed =
    (allowedRoles && hasGlobalAccess) ||
    (allowedLocalRoles && hasLocalAccess) ||
    (!allowedRoles && !allowedLocalRoles);

  return isAllowed ? <Outlet /> : <ForbiddenPage />;
}
