import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function PublicRoute() {
  const { isInitialized, accessToken } = useSelector(
    (state: RootState) => state.auth,
  );
  if (!isInitialized) {
    return (
      <div className="h-screen w-full bg-background text-white text-2xl flex items-center justify-center">
        Загрузка...
      </div>
    );
  } else if (accessToken === null) {
    return <Outlet />;
  } else {
    return <Navigate to="/hub" replace />;
  }
}
