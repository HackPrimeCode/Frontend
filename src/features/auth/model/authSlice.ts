import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthResponse, User } from "./authTypes";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state: AuthState, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.access_token;
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
    updateUser(state: AuthState, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setCredentials,
  logout,
  updateAccessToken,
  setInitialized,
  updateUser,
} = authSlice.actions;
export default authSlice.reducer;
