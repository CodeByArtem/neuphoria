import apiClient from "./api";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL не задан");
}

// Получение профиля пользователя
export const getUserProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return null; // Если нет токена, просто не делаем запрос
    }
    const response = await axios.get(`${API_URL}/user/me`, {
        headers: {
            Authorization: ` ${token}`, // ✅ Исправлено
        },
    });

    return response.data;
};

// Обновление профиля пользователя
export const updateUserProfile = async (data: { email: string }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Токен отсутствует");
    }

    const response = await apiClient.put("/user", data, {
        headers: {
            Authorization: ` ${token}`, // ✅ Исправлено
        },
    });

    return response.data;
};

// Удаление пользователя
export const deleteUser = async () => {
    const userProfile = await getUserProfile(); // Получаем профиль
    const userId = userProfile.id; // Берем ID пользователя

    if (!userId) {
        throw new Error("Ошибка: ID пользователя не найден.");
    }

    const response = await apiClient.delete(`/user/${userId}`, {
        headers: {
            Authorization: ` ${localStorage.getItem("token")}`, // ✅ Добавлен заголовок
        },
    });

    return response.data;
};
