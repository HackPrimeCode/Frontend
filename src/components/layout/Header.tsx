import { Link, useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useLogoutMutation } from "@/features/auth/api/authApi";

interface NavItem {
  path: string;
  label: string;
  icon: keyof typeof IconImages;
  hasAccess: (globalRole: string, contextRole?: string | null) => boolean;
}

const navItems: NavItem[] = [
  { path: "/hub", label: "Мероприятия", icon: "hub", hasAccess: () => true },
  {
    path: "/team",
    label: "Команда",
    icon: "team",
    hasAccess: (global, context) => global === "user" && context !== "judge",
  },
  {
    path: "/worktable",
    label: "Рабочий стол",
    icon: "worktable",
    hasAccess: (global, context) => global === "user" && context !== "judge",
  },
  {
    path: "/leaderboard",
    label: "Рейтинг",
    icon: "leaderboard",
    hasAccess: () => true,
  },
  {
    path: "/profile",
    label: "Профиль",
    icon: "profile",
    hasAccess: () => true,
  },

  {
    path: "/judge",
    label: "Жюри",
    icon: "judge",
    hasAccess: (global, context) => global === "admin" || context === "judge",
  },
  {
    path: "/organizer",
    label: "Организатор",
    icon: "organizer",
    hasAccess: (global) => global === "organizator" || global === "admin",
  },
  {
    path: "/admin",
    label: "Админ",
    icon: "admin",
    hasAccess: (global) => global === "admin",
  },
];

const IconImages = {
  hub: { default: "/hub-icon.svg", active: "/hub-icon-active.svg" },
  team: { default: "/team-icon.svg", active: "/team-icon-active.svg" },
  worktable: {
    default: "/worktable-icon.svg",
    active: "/worktable-icon-active.svg",
  },
  leaderboard: {
    default: "/leaderboard-icon.svg",
    active: "/leaderboard-icon-active.svg",
  },
  profile: { default: "/profile-icon.svg", active: "/profile-icon-active.svg" },
  judge: { default: "/judge-icon.svg", active: "/judge-icon-active.svg" },
  organizer: {
    default: "/organizer-icon.svg",
    active: "/organizer-icon-active.svg",
  },
  admin: { default: "/admin-icon.svg", active: "/admin-icon-active.svg" },
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { user, currentContext } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        logoutRef.current &&
        !logoutRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  function toggleDropdownMenu() {
    setIsMenuOpen((prev) => !prev);
  }
  function toggleNotificationMenu() {
    setIsNotificationsOpen((prev) => !prev);
  }
  async function handleLogout() {
    try {
      await logout().unwrap();

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Не удалось выйти из системы:", error);
    } finally {
      setIsMenuOpen(false);
    }
  }

  const visibleNavItems = navItems.filter((item) => {
    if (!user) return false;

    return item.hasAccess(user.global_role, currentContext?.localRole);
  });

  return (
    <header className="flex justify-between h-15 w-full px-8 items-center border-b border-b-border">
      <div className="flex gap-9">
        <div className="flex gap-1 items-center">
          <Button
            onClick={() => navigate("/", { replace: true })}
            className="cursor-pointer"
          >
            <img
              src="/HackPrimeCode-logo.svg"
              alt="logo"
              className="w-9 h-7 -translate-y-0.5"
            />
            <span className="text-white">
              Hack<span className="text-red">Prime</span>Code
            </span>
          </Button>
        </div>
        <div className="flex gap-6">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path;

            const currentIcon = isActive
              ? IconImages[item.icon].active
              : IconImages[item.icon].default;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                  isActive
                    ? "px-3.5 py-2 rounded-lg border bg-red/6 border-red text-red "
                    : "p-0 bg-transparent border-none text-text-accent hover:text-text"
                }`}
              >
                <img src={currentIcon} alt="" className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {user ? (
        <div className="relative flex items-center gap-2.5 text-white">
          <div className="relative" ref={notificationRef}>
            <Button
              onClick={toggleNotificationMenu}
              className="flex items-center cursor-pointer rounded-full p-2 hover:bg-card-background/60"
            >
              <img src="/notification-icon.svg" alt="" className="w-4 h-4" />
            </Button>
            {isNotificationsOpen && (
              <div className="absolute text-center top-full bg-card-background w-96 rounded-lg px-4 py-3 right-0 mt-2 z-50">
                <h1>У вас пока нет уведомлений</h1>
              </div>
            )}
          </div>

          <div className="items-center w-0.5 bg-border h-6"></div>
          <div className="flex items-center gap-2">
            <div className="text-sm w-6.5 h-6.5 bg-red flex items-center justify-center rounded-full">
              <span className="-translate-y-px">{user.name[0]}</span>
            </div>
            <div className="relative" ref={logoutRef}>
              <Button
                onClick={toggleDropdownMenu}
                className="flex items-center gap-2 cursor-pointer p-0"
              >
                <span>{user.name}</span>
                <img
                  src="/dropdown-icon.svg"
                  alt=""
                  className={`w-2.5 h-1.5 transition-all duration-300 ${isMenuOpen && "-rotate-180"}`}
                />
              </Button>
              {isMenuOpen && (
                <div className="absolute text-right top-full w-24 rounded-lg right-0 mt-2 z-50">
                  <Button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="text-red border bg-background border-red px-4 cursor-pointer hover:bg-red/25"
                  >
                    {isLoading ? "Выход..." : "Выйти"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        !isAuthPage && (
          <Link
            to={"/login"}
            className="border-[0.5px] h-10 border-red px-5 py-2.5 text-white text-sm flex items-center gap-3 cursor-pointer rounded-lg"
          >
            <span>Войти в аккаунт</span>
            <img
              src="/arrow-icon.svg"
              alt=""
              className="h-3 w-3 translate-y-0.5"
            />
          </Link>
        )
      )}
    </header>
  );
}
