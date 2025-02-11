"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks"; // Хуки для работы с Redux
import { clearUser } from "@/store/slices/authSlice"; // Экшен для очистки пользователя
import usePosts from "@/hooks/usePosts"; // Хук для получения постов
import LogoutButton from "@/components/btn/LogoutButton"; // Кнопка выхода

export default function Page() {
    const dispatch = useAppDispatch(); // Диспетчер для вызова экшенов
    const { posts, loading } = usePosts(); // Загружаем посты с хука
    const user = useAppSelector((state) => state.auth.user); // Получаем данные пользователя из Redux

    console.log("User from Redux:", user); // Логируем состояние пользователя из Redux
    console.log("Posts:", posts); // Логируем полученные посты
    console.log("Loading state:", loading); // Логируем состояние загрузки

    // Если пользователь не авторизован
    if (!user) {
        return <p>Вы не авторизованы</p>;
    }

    const handleLogout = () => {
        dispatch(clearUser()); // Очищаем данные пользователя из стора
        localStorage.removeItem("user"); // Убираем данные пользователя из localStorage
        console.log("User logged out."); // Логируем событие выхода
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <h3>Forum</h3>
            <LogoutButton onClick={handleLogout} /> {/* Кнопка для выхода */}
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Постов пока нет</p>
            )}
        </div>
    );
}
