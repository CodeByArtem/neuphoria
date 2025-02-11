// actions/authActions.ts

import { refreshTokenSuccess } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import axios, { AxiosError } from 'axios';


export const refreshToken = () => async (dispatch: AppDispatch): Promise<string | undefined> => {
    try {
        const { data } = await axios.get("https://nestbackgame.onrender.com/api/auth/refresh-tokens", {
            withCredentials: true, // Проверяем, передаются ли куки
        });
        console.log("✅ Новый токен:", data.accessToken);
        dispatch(refreshTokenSuccess({ accessToken: data.accessToken }));
        return data.accessToken;
    } catch (error: unknown) {
        // Проверка типа ошибки и наличие ответа
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError; // Приведение к типу AxiosError
            if (axiosError.response) {
                if (axiosError.response.status === 401) {
                    console.error("Ошибка обновления токена: Неверный или истекший токен.");
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
