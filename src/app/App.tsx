import { useRefreshSessionMutation } from "@/features/auth/api/authApi";
import { useEffect, type ReactNode } from "react";

function AppInit({ children }: { children: ReactNode }) {
  const [refresh] = useRefreshSessionMutation();
  useEffect(() => {
    refresh();
  }, []);
  return children;
}

export default AppInit;
