import { useRefreshSessionMutation } from "@/features/auth/api/authApi";
import { useEffect, useRef, type ReactNode } from "react";

function AppInit({ children }: { children: ReactNode }) {
  const [refresh, { isLoading }] = useRefreshSessionMutation();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    refresh();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return children;
}

export default AppInit;
