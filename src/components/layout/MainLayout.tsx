import Header from "./Header";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <Outlet />
    </div>
  );
}
