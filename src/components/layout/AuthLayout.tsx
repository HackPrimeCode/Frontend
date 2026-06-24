import { Outlet } from "react-router";
import Header from "./Header";

export default function AuthLayout() {
  return (
    <div>
      <Header />
      <main>
        <div>Actual hackathon info</div>
        <Outlet />
      </main>
    </div>
  );
}
