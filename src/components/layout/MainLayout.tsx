import Header from "./Header";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
