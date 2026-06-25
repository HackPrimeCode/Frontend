import AuthLayout from "@/components/layout/AuthLayout";
import MainLayout from "@/components/layout/MainLayout";
import { wrapLazy } from "@/components/lazyComponent";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import { createBrowserRouter } from "react-router";

const routes = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/hub",
        lazy: () => wrapLazy(() => import("@/pages/HubPage")),
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            lazy: () => wrapLazy(() => import("@/pages/LandingPage")),
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            lazy: () => wrapLazy(() => import("@/pages/auth/LoginPage")),
          },
          {
            path: "/register",
            lazy: () => wrapLazy(() => import("@/pages/auth/RegisterPage")),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/leaderboard",
            lazy: () => wrapLazy(() => import("@/pages/LeaderboardPage")),
          },
          {
            path: "/profile",
            lazy: () => wrapLazy(() => import("@/pages/ProfilePage")),
          },
          {
            path: "/team",
            lazy: () => wrapLazy(() => import("@/pages/TeamPage")),
          },
          {
            path: "/worktable",
            lazy: () => wrapLazy(() => import("@/pages/WorkTablePage")),
          },
        ],
      },
      {
        element: (
          <RoleProtectedRoute
            allowedRoles={["admin"]}
            allowedLocalRoles={["judge"]}
          />
        ),
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: "/judge",
                lazy: () => wrapLazy(() => import("@/pages/JudgePage")),
              },
            ],
          },
        ],
      },
      {
        element: <RoleProtectedRoute allowedRoles={["organizator", "admin"]} />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: "/organizer",
                lazy: () => wrapLazy(() => import("@/pages/OrganizerPage")),
              },
            ],
          },
        ],
      },
      {
        element: <RoleProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: "/admin",
                lazy: () => wrapLazy(() => import("@/pages/AdminPage")),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
