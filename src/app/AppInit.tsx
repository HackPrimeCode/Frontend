import { useRefreshSessionMutation } from "@/features/auth/api/authApi";
import { useEffect, useRef, type ReactNode } from "react";

function AppInit({ children }: { children: ReactNode }) {
  const [refresh] = useRefreshSessionMutation();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    refresh();
  }, []);

  return children;
}

export default AppInit;
