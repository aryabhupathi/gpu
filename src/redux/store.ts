import { configureStore } from '@reduxjs/toolkit';
import forumReducer from './slices/forumSlice';
import commentReducer from './slices/commentSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    forum: forumReducer,
    comment: commentReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;