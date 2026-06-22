import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoute() {
  const { isInitialized, accessToken } = useSelector(
    (state: RootState) => state.auth,
  );
  const location = useLocation();
  if (!isInitialized) {
    return <div>Загрузка...</div>;
  } else if (accessToken === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  } else {
    return <Outlet />;
  }
}
