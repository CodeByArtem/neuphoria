// actions/authActions.ts

import { refreshTokenSuccess } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import axios, { AxiosError } from 'axios';



export const refreshToken = () => async (dispatch: AppDispatch): Promise<string | undefined> => {
    // Проверяем наличие токена в localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    // Если токен отсутствует, запрос на обновление токена не выполняем
    if (!token) {
        console.warn("Токен отсутствует, запрос на обновление токена не может быть выполнен.");
        return undefined;
    }

    try {
        const { data } = await axios.get("https://nestbackgame.onrender.com/api/auth/refresh-tokens", {
            withCredentials: true, // Проверяем, передаются ли куки
        });
        console.log("✅ Новый токен:", data.accessToken);
        dispatch(refreshTokenSuccess({ accessToken: data.accessToken }));
        return data.accessToken;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                if (axiosError.response.status === 401) {
                    console.error("Ошибка обновления токена: Неверный или истекший токен.");
                    // Очистить токен и вернуть пользователя на страницу входа
                    localStorage.removeItem("token");
                    // history.push('/login'); // Если используешь роутер
                } else {
                    console.error("Ошибка обновления токена:", axiosError.message);
                }
            } else {
                console.error("Ошибка обновления токена без ответа от сервера:", axiosError.message);
            }
        } else {
            console.error("Неизвестная ошибка:", error);
        }
        return undefined;
    }
};
