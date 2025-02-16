// Функция для выполнения запросов с токеном
import apiClient from "@/services/userApi";
import {AppDispatch} from "@/store/store";
import {clearUser} from "@/store/slices/authSlice";
import Cookies from "js-cookie";

const requestWithAuth = async (method: string, url: string, data?: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    // Проверяем наличие токена
    if (!token) {
        console.warn("Токен отсутствует, запрос не может быть выполнен.");
        return { error: "Токен отсутствует. Авторизация необходима." }; // Возвращаем ошибку, чтобы можно было обработать на уровне компонента
    }


    try {
        const response = await apiClient.request({
            method,
            url,
            data,
            headers: {
                Authorization: ` ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`${method} запрос на ${url} не удался`, error);
        throw error; // Прокидываем ошибку дальше
    }
};

// Получение профиля пользователя
export const getUserProfile = async () => {

    return await requestWithAuth("get", "/user/me");
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
        Cookies.remove("token");
        Cookies.remove("refresh_token");

        // Очистка данных пользователя из Redux
        dispatch(clearUser());
    } catch (err) {
        console.error("Ошибка при логауте:", err);
    }
};