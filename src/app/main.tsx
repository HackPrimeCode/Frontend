import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { router } from "./router.tsx";
import { store } from "@/store/index.ts";
import AppInit from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppInit>
        <RouterProvider router={router} />
      </AppInit>
    </Provider>
  </StrictMode>,
);
