import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRefreshSessionMutation } from "@/features/auth/api/authApi";
import { setInitialized } from "@/features/auth/model/authSlice";
import { useDispatch } from "react-redux";
import { useGetUserProfileLazyQuery } from "@/features/profile/api/profileApi";

function AppInit({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const [refresh, { isLoading: isRefreshLoading }] =
    useRefreshSessionMutation();

  const [triggerGetUserProfile] = useGetUserProfileLazyQuery();

  const [isChainLoading, setIsChainLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initAuthChain = async () => {
      try {
        await refresh().unwrap();
        await triggerGetUserProfile().unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        setIsChainLoading(false);
        dispatch(setInitialized(true));
      }
    };

    initAuthChain();
  }, [refresh, triggerGetUserProfile, dispatch]);

  if (isRefreshLoading || isChainLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return children;
}

export default AppInit;
