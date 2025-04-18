import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface AuthState {
  user: {
    name: string;
    email: string;
    image: string | null;
  } | null;
  isAuthenticated: boolean;
}
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        image: string | null;
      }>
    ) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
