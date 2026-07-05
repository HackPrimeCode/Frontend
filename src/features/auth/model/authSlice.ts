import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  AuthResponse,
  User,
  CurrentContext,
} from "./authTypes";
import type { RootState } from "@/store";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isInitialized: false,
  context: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state: AuthState, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.access_token;
    },
    setContext(state: AuthState, action: PayloadAction<CurrentContext>) {
      state.context = action.payload;
    },
    logout(state: AuthState) {
      state.user = null;
      state.accessToken = null;
      state.context = null;
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

export const selectCurrentContext = (state: RootState) => state.auth.context;
export const selectIsAuthenticated = (state: RootState) =>
  !!state.auth.accessToken;
export const selectIsInitialized = (state: RootState) =>
  state.auth.isInitialized;
export const selectActiveHackathonId = (state: RootState) =>
  state.auth.context?.hackathonId;
export const selectCurrentTeamId = (state: RootState) =>
  state.auth.context?.teamId;
export const selectIsCaptain = (state: RootState) =>
  state.auth.context?.roleInTeam === "captain";
export const selectGlobalRole = (state: RootState) =>
  state.auth.user?.global_role;

export const {
  setCredentials,
  setContext,
  logout,
  updateAccessToken,
  setInitialized,
  updateUser,
} = authSlice.actions;
export default authSlice.reducer;
