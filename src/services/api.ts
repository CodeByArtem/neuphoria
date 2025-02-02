import axios from "axios";

export const apiClient = axios.create({
    baseURL: "https://nestbackgame.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Включаем отправку куков, включая refreshToken
});

// Интерцептор для обработки 401 ошибок
apiClient.interceptors.response.use(
    response => response, // Оставляем успешные ответы как есть
    async (error) => {
        const originalRequest = error.config;

        // Проверяем, если ошибка 401 и запрос еще не был перезапущен (чтобы избежать зацикливания)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Попытка обновить токен с использованием refreshToken, который находится в cookie
                const refreshResponse = await apiClient.post("/auth/refresh-token", {}, { withCredentials: true });

                // Сохраняем новый токен (если необходимо)
                const newToken = refreshResponse.data.accessToken;
                if (newToken) {
                    localStorage.setItem("token", newToken); // Сохраняем новый токен в localStorage
                    // Устанавливаем новый токен в заголовок для повторного запроса
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    // Повторно отправляем запрос с обновленным токеном
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error("Ошибка обновления токена", refreshError);
                // Выход из системы, если обновление токена не удалось
                localStorage.removeItem("token"); // Удаляем токен из localStorage
                document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Удаляем refreshToken из cookie
                window.location.href = "/login"; // Перенаправляем на страницу входа
            }
        }

        // Возвращаем ошибку, если токен не был обновлен или другая ошибка
        return Promise.reject(error);
    }
);
export const logout = async () => {
    try {
        // Отправляем запрос на сервер для логаута
        await apiClient.post("/auth/logout", {}, { withCredentials: true });

        // Удаляем токены и куки
        localStorage.removeItem("token");
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Удаляем refreshToken из cookie

        // Перенаправляем пользователя на страницу входа
        window.location.href = "/auth/login"; // Можно заменить на использование `router.push('/login')` если используется React Router
    } catch (error) {
        console.error("Ошибка логаута", error);
        // Даже в случае ошибки можно перенаправить на страницу входа
        window.location.href = "/auth/login";
    }
};

export default apiClient;