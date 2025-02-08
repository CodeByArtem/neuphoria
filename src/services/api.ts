import axios from "axios";
import {clearUser} from "@/store/slices/authSlice";
import {store} from "@/store/store";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": typeof window !== "undefined" && localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : ""
    },
    withCredentials: true,
});

// Интерцептор для обработки 401 ошибок
apiClient.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await apiClient.post("/auth/refresh-tokens", {}, { withCredentials: true });
                const newToken = refreshResponse.data.accessToken;
                if (newToken) {
                    if (typeof window !== "undefined") {
                        localStorage.setItem("token", newToken);
                    }
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error("Ошибка обновления токена", refreshError);
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

                }
            }
        }
        return Promise.reject(error);
    }
);
export const logoutUser = async () => {
    try {
        await apiClient.post("/auth/logout");
    } catch (error) {
        console.error("Ошибка логаута", error);
    } finally {
        handleLogout();
    }
};

// Очистка Redux, localStorage и редирект
const handleLogout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        store.dispatch(clearUser()); // Очищаем Redux
        window.location.href = "/auth"; // Редирект на страницу входа
    }
};

export default apiClient;
