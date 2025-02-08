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

    const handleLogout = () => {
        dispatch(clearUser()); // Очистка пользователя из стора
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <Provider store={store}>
            <div>
                <h1>Forum</h1>
                <LogoutButton onClick={handleLogout} />
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </Provider>
    );
}
