// Функция для выполнения запросов с токеном
import apiClient from "@/services/userApi";
import { AppDispatch } from "@/store/store";
import { clearUser } from "@/store/slices/authSlice";
import Cookies from "js-cookie";

interface UserProfile {
    id: string;
    email: string;
    name: string;
}

const requestWithAuth = async <T = unknown, R = unknown>(
    method: string,
    url: string,
    data?: T
): Promise<R> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
        console.warn("Токен отсутствует, запрос не может быть выполнен.");
        return Promise.reject(new Error("Токен отсутствует. Авторизация необходима."));
    }

    try {
        const response = await apiClient.request<R>({
            method,
            url,
            data,
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error(`${method} запрос на ${url} не удался`, error);
        return Promise.reject(error);
    }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
        console.log("getUserProfile: Нет токена");
        return null;
    }

    try {
        return await requestWithAuth<undefined, UserProfile>("get", "/user/me");
    } catch (error) {
        console.error("Ошибка получения профиля:", error);
        return null;
    }
};

export const updateUserProfile = async (data: { email: string }) => {
    return await requestWithAuth<typeof data, UserProfile>("put", "/user", data);
};

export const deleteUser = async (): Promise<void> => {
    const userProfile = await getUserProfile();
    const userId = userProfile?.id;

    if (!userId) {
        throw new Error("Ошибка: ID пользователя не найден.");
    }

    await requestWithAuth<undefined, void>("delete", `/user/${userId}`);
};

export const logoutUser = async (dispatch: AppDispatch) => {
    try {
        await apiClient.post("/auth/logout");

        Cookies.remove("token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });

        dispatch(clearUser());
    } catch (error) {
        console.error("Ошибка при логауте:", error);
    }
};
