// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface AuthState {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('/api/auth/register', userData);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Registration failed');
//     }
//   }
// );

// export const fetchUserProfile = createAsyncThunk(
//   'auth/fetchProfile',
//   async (userId: string, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/api/users/${userId}`);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch profile');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser(state, action: PayloadAction<User | null>) {
//       state.user = action.payload;
//     },
//     clearError(state) {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { setUser, clearError } = authSlice.actions;
// export default authSlice.reducer;


// /redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    name: string;
    image: string | null;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ name: string; image: string | null }>) {
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
