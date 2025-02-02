import axios from 'axios';

export const apiClient = axios.create({
    baseURL: "https://nestbackgame.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Включаем отправку куков, включая refreshToken
});

apiClient.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            try {
                // Попытка обновить токен с использованием refreshToken, который находится в cookie
                const response = await apiClient.post("/auth/refresh-token", {}, { withCredentials: true });
                return apiClient(error.config); // Автоматически отправим повторный запрос с новым токеном
            } catch (e) {
                console.error("Ошибка обновления токена", e);
            }
        }
        return Promise.reject(error);
    }
);
