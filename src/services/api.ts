// Функция для выполнения запросов с токеном
import apiClient from "@/services/userApi";
import {AppDispatch} from "@/store/store";
import {clearUser} from "@/store/slices/authSlice";


const requestWithAuth = async (method: string, url: string, data?: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Токен отсутствует");
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
    console.log("Профиль пользователя:", getUserProfile);
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
        // Отправляем запрос на сервер для выхода
        await apiClient.post("/auth/logout"); // Предполагаем, что у тебя есть такой эндпоинт

        // Очистка состояния пользователя в Redux
        dispatch(clearUser());

        // Удаление токена из localStorage
        localStorage.removeItem("token");

        // Перенаправление на страницу логина
        // Этот код нужно будет вызвать в компоненте, так как useRouter только в компонентах
    } catch (error) {
        console.error("Ошибка выхода:", error);
    }
};