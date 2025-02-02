"use client";

import { Provider } from 'react-redux'; // Импортируйте Provider
import { store } from '@/store/store'; // Ваш store
import usePosts from "@/hooks/usePosts";
import LogoutButton from "@/components/btn/LogoutButton";


export default function Posts() {
    const { posts, loading, error } = usePosts();

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <Provider store={store}>
        <div>
            <h1>Forum</h1>
            <LogoutButton/>

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
