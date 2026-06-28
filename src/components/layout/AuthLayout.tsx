import { Outlet } from "react-router";
import Header from "./Header";
import ActualHackathonInfo from "@/features/auth/components/ActualHackathonInfo";

export default function AuthLayout() {
  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <Header />
      <main className="relative flex-1 grid grid-cols-2 max-w-360 w-full mx-auto mt-15">
        <div className="flex flex-col gap-27.5 w-full max-w-140 mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <img
              src="/HackPrimeCode-logo.svg"
              alt="logo"
              className="w-28.5 h-22.5 mb-7"
            />
            <span className="text-6xl text-white">
              Hack<span className="text-red">Prime</span>
            </span>
            <div>
              <span className="text-6xl text-red">Code</span>
            </div>
            <span className="text-white text-3xl mt-4 tracking-wide">
              Code.Compete.Conquer.
            </span>
          </div>
          <ActualHackathonInfo />
        </div>
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 bg-red/25 w-px"></div>
        <div className="flex justify-center w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
