// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postsSlice";
import commentsReducer from "./slices/commentsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    comments: commentsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Экспорт типов
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
