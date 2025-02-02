import { useState, useEffect } from "react";
import {apiClient} from "@/services/api";


export default function usePosts() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Токен отсутствует");

                const response = await apiClient.get("/posts", {
                    headers: { Authorization: ` ${token}` }, // передаем токен с запросом
                    withCredentials: true, // разрешаем отправку cookies
                });

                if (isMounted) {
                    setPosts(response.data.posts || []);
                }
            } catch (err: any) {
                if (isMounted) {
                    if (err.response && err.response.status === 401) {
                        setError("Неавторизованный запрос. Пожалуйста, войдите в систему.");
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
