import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function PublicRoute() {
  const { isInitialized, accessToken } = useSelector(
    (state: RootState) => state.auth,
  );
  if (!isInitialized) {
    return <div>Загрузка...</div>;
  } else if (accessToken === null) {
    return <Outlet />;
  } else {
    return <Navigate to="/hub" replace />;
  }
}
