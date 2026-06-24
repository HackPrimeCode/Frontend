import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthResponse, CurrentContext } from "./authTypes";

const initialState: AuthState = {
  user: {
    id: 1,
    name: "Артем",
    surname: "Степанов",
    email: "artem@gmail.com",
    role: "USER",
  },
  accessToken: "access-token",
  isInitialized: true,
  currentContext: {
    hackathonId: 1,
    localRole: "MEMBER",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state: AuthState, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    logout(state: AuthState) {
      state.user = null;
      state.accessToken = null;
      state.isInitialized = true;
    },
    updateAccessToken(state: AuthState, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setInitialized(state: AuthState, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
    setContext(state: AuthState, action: PayloadAction<CurrentContext | null>) {
      state.currentContext = action.payload;
    },
  },
});

export const { setCredentials, logout, updateAccessToken, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
