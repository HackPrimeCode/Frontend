import { useEffect, useState, type ReactNode } from "react";
import { useRefreshSessionMutation } from "@/features/auth/api/authApi";
import {
  selectIsAuthenticated,
  setCredentials,
  setInitialized,
} from "@/features/auth/model/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserProfileLazyQuery } from "@/features/profile/api/profileApi";

function AppInit({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isChainLoading, setIsChainLoading] = useState(true);

  const [refresh] = useRefreshSessionMutation();
  const [triggerGetUserProfile] = useGetUserProfileLazyQuery();

  useEffect(() => {
    const initAuthChain = async () => {
      try {
        const response = await refresh().unwrap();
        dispatch(setCredentials(response));

        console.log("Автоматический рефреш выполнен успешно");
      } catch (error) {
        console.log("Старая сессия отсутствует или истекла");
      } finally {
        setIsChainLoading(false);
        dispatch(setInitialized(true));
      }
    };

    initAuthChain();
  }, [refresh, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Авторизация подтверждена. Загружаем профиль...");
      triggerGetUserProfile()
        .unwrap()
        .catch((err) => console.error("Не удалось загрузить профиль:", err));
    }
  }, [isAuthenticated, triggerGetUserProfile]);

  if (isChainLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <span className="animate-pulse text-sm text-white">
          Инициализация приложения...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}

export default AppInit;
