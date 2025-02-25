// Функция для выполнения запросов с токеном
import apiClient from "@/services/userApi";
import {AppDispatch} from "@/store/store";
import {clearUser} from "@/store/slices/authSlice";
import Cookies from "js-cookie";

const requestWithAuth = async (method: string, url: string, data?: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (!token) {
        // Если токен отсутствует, возвращаем ошибку и не выполняем запрос
        console.warn("Токен отсутствует, запрос не может быть выполнен.");
        return {error: "Токен отсутствует. Авторизация необходима."};
    }
    try {
        const response = await apiClient.request({
            method,
            url,
            data,
            headers: {
                Authorization: `${token}`, // Добавляем Bearer
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`${method} запрос на ${url} не удался`, error);
        throw error;
    }
};

export const getUserProfile = async () => {
    // Проверяем наличие токена
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (!token) {
        console.warn("Токен отсутствует, запрос не может быть выполнен.");
        return null; // Если токен отсутствует, возвращаем null, запрос не выполняем
    }

    try {
        return await requestWithAuth("get", "/user/me");
    } catch (error) {
        console.error("Ошибка получения профиля:", error);
        return null;
    }
};



// Обновление профиля пользователя
export const updateUserProfile = async (data: { email: string }) => {
    return await requestWithAuth("put", "/user", data);
};

// Удаление пользователя
export const deleteUser = async () => {
    const userProfile = await getUserProfile();
    const userId = userProfile?.id;

    if (!userId) {
        throw new Error("Ошибка: ID пользователя не найден.");
    }

    return await requestWithAuth("delete", `/user/${userId}`);
};

export const logoutUser = async (dispatch: AppDispatch) => {
    try {
        // Отправить запрос на логаут, если есть такой эндпоинт
        await apiClient.post("/auth/logout");

        // Удалить токен и refresh токен из куки
        Cookies.remove("token", { path: "/" }); // Убедитесь, что путь верный
        Cookies.remove("refresh_token", { path: "/" });

        // Очистка данных пользователя из Redux
        dispatch(clearUser());
    } catch (err) {
        console.error("Ошибка при логауте:", err);
    }
};