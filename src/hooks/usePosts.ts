import { useState, useEffect } from "react";
import { apiClient } from "@/services/api";

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}

export default function usePosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Токен отсутствует");

                const response = await apiClient.get<{ posts: Post[] }>("/posts", {
                    headers: { Authorization: ` ${token}` },
                    withCredentials: true,
                });

                if (isMounted) {
                    setPosts(response.data.posts || []);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    if (err instanceof Error) {
                        setError(err.message); // Используем err.message
                    } else {
                        setError("Ошибка загрузки постов");
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPosts();

        return () => {
            isMounted = false;
        };
    }, []);

    return { posts, loading, error };
}
