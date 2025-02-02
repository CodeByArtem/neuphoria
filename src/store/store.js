import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Используем правильные хуки
export const useAppDispatch = () => useDispatch();
export const useAppSelector = (state) => useSelector(state);
