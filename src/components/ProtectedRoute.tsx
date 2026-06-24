import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoute() {
  const { isInitialized, accessToken } = useSelector(
    (state: RootState) => state.auth,
  );
  const location = useLocation();
  if (!isInitialized) {
    return (
      <div className="h-screen w-full bg-background text-white text-2xl flex items-center justify-center">
        Загрузка...
      </div>
    );
  } else if (accessToken === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  } else {
    return <Outlet />;
  }
}
