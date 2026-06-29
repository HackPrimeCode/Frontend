import type { RootState } from "@/store";
import { useSelector } from "react-redux";

export function useAuth() {
  const isAuthenticated = useSelector(
    (state: RootState) => !!state.auth.accessToken,
  );
  const isInitialized = useSelector(
    (state: RootState) => state.auth.isInitialized,
  );

  return { isAuthenticated, isInitialized };
}
