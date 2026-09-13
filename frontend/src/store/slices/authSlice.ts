import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '@/types/user';
import { authStorage } from '@/utils/auth-storage';

export interface ExtendedAuthState extends AuthState {
  isInitialized: boolean;
  error: string | null;
}

const initialUser = authStorage.getUser() as User | null;
const initialToken = authStorage.getAccessToken();

const initialState: ExtendedAuthState = {
  user: initialUser,
  accessToken: initialToken,
  refreshToken: authStorage.getRefreshToken(),
  isAuthenticated: !!initialToken,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken?: string }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;

      authStorage.setAccessToken(accessToken);
      if (refreshToken) authStorage.setRefreshToken(refreshToken);
      if (user) authStorage.setUser(user);
    },

    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>
    ) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;

      authStorage.setAccessToken(accessToken);
      if (refreshToken) authStorage.setRefreshToken(refreshToken);
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      authStorage.setUser(action.payload);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      authStorage.clearAuth();
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCredentials,
  setTokens,
  updateUser,
  logout,
  setLoading,
  setInitialized,
  setError,
} = authSlice.actions;

export default authSlice.reducer;
