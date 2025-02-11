import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Определение интерфейса для пользователя
interface User {
  id: string;
  email: string;
}

// Определение интерфейса для состояния аутентификации
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: !!(typeof window !== 'undefined' && localStorage.getItem('token')),
};

// Слайс для работы с аутентификацией
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Установка пользователя и токена
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log("Action payload:", action.payload);  // Логируем переданные данные
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },

    // Обновление токена
    refreshTokenSuccess: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.token = action.payload.accessToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.accessToken);
      }
    },

    // Очистка данных пользователя
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
});

// Экспортируем действия для использования в компонентах
export const { setUser, refreshTokenSuccess, clearUser } = authSlice.actions;

// Экспортируем редьюсер для использования в store
export default authSlice.reducer;
