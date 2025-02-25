import axios from "axios";
import { store } from "@/store/store";


import {refreshToken} from "@/store/authActions";

// Проверка, выполняется ли код на клиенте
const isClient = typeof window !== "undefined";

// Функция для получения токена из localStorage
const getToken = () => {
    if (isClient) {
        return localStorage.getItem("token");
    }
    return null; // Если выполняется на сервере, возвращаем null
};

// Создаем axios клиент
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": getToken() ? ` ${getToken()}` : "", // Добавляем токен только если он существует
    },
    withCredentials: true,
});

// Интерцептор для запроса - добавляем токен в заголовки только если токен есть
apiClient.interceptors.request.use(
    async (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = ` ${token}`;
        } else {
            return Promise.reject(new Error("Токен отсутствует"));
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Интерцептор для ответа - обработка ошибки 401 и обновление токена
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 (не авторизован) и запрос еще не повторялся
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const token = getToken();
            if (!token) {
                return Promise.reject(error); // Если нет токена, отклоняем ошибку
            }

            // Попытка обновить токен
            try {
                const newToken = await store.dispatch(refreshToken());

                if (newToken) {
                    originalRequest.headers["Authorization"] = ` ${newToken}`;
                    return apiClient(originalRequest); // Повторяем запрос с новым токеном
                }
            } catch (error) {
                return Promise.reject(error); // Ошибка при обновлении токена
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
