"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import usePosts from "@/hooks/usePosts";
import LogoutButton from "@/components/btn/LogoutButton";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/authSlice";

export default function Page() {
    const { posts, loading, error } = usePosts();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem("token");
    const handleLogout = () => {
        dispatch(clearUser()); // Очистка пользователя из стора
    };

    if (loading) return <p>Загрузка...</p>;

    if (!token) return <p>Вы не авторизованы</p>;

    return (
        <Provider store={store}>
            <div>
                <h3>Forum</h3>
                <LogoutButton />
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
        </Provider>
    );
}
