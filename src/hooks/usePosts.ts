"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";  // Импортируем хуки для работы с Redux
import { setPosts, setLoading, setError } from "@/store/slices/postsSlice";  // Импортируем экшены
import apiClient from "@/services/userApi";

export default function usePosts() {
    const dispatch = useAppDispatch();
    const { posts, loading, error } = useAppSelector((state) => state.posts);  // Получаем данные из Redux

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem("token");
            console.log("Token from localStorage:", token); // Логируем токен
            if (!token) {
                dispatch(setError("Token is missing"));
                return;
            }

            dispatch(setLoading(true)); // Устанавливаем состояние загрузки в true

            try {
                const response = await apiClient.get("/posts", {
                    headers: {
                        "Authorization": ` ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                dispatch(setPosts(response.data.posts || []));  // Сохраняем посты в Redux
            } catch (err) {
                dispatch(setError("Ошибка загрузки постов"));
                console.error("Error fetching posts:", err);  // Логируем ошибку
            } finally {
                dispatch(setLoading(false));  // Устанавливаем состояние загрузки в false
            }
        };

        fetchPosts();
    }, [dispatch]);

    return { posts, loading, error };
}
