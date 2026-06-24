import Header from "./Header";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="h-screen w-full bg-background">
      <Header />
      <Outlet />
    </div>
  );
}
