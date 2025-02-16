"use client"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setPosts,
    setLoading,
    setError,
    deletePost,
    updatePost,
    addPost,
} from "@/store/slices/postsSlice";
import apiClient from "@/services/userApi";

export default function usePosts() {
    const dispatch = useAppDispatch();
    const { posts, loading, error } = useAppSelector((state) => state.posts);
    const { isAuthenticated } = useAppSelector((state) => state.auth); // Получаем состояние аутентификации

    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (!isAuthenticated) { // Используем isAuthenticated для проверки
            dispatch(setError("Token is missing"));
            return; // Останавливаем выполнение, если токен отсутствует
        }
        fetchPosts();
    }, [dispatch, token, isAuthenticated]);

    const fetchPosts = async () => {
        if (!token) {
            return; // Прекращаем запрос, если токен отсутствует
        }
        dispatch(setLoading(true));

        try {
            const response = await apiClient.get("/posts", {
                headers: {
                    Authorization: ` ${token}`,
                    "Content-Type": "application/json",
                },
            });
            dispatch(setPosts(response.data.posts || []));
        } catch (err) {
            dispatch(setError("Ошибка загрузки постов"));
            console.error("Error fetching posts:", err);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createPost = async (title: string, content: string) => {
        if (!token) {
            return; // Прекращаем выполнение, если токен отсутствует
        }
        try {
            const response = await apiClient.post(
                "/posts",
                { title, content },
                {
                    headers: {
                        Authorization: ` ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            dispatch(addPost(response.data.post));
        } catch (err) {
            console.error("Ошибка создания поста:", err);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!token) {
            return; // Прекращаем выполнение, если токен отсутствует
        }
        try {
            await apiClient.delete(`/posts/${postId}`, {
                headers: {
                    Authorization: ` ${token}`,
                    "Content-Type": "application/json",
                },
            });
            dispatch(deletePost(postId));
        } catch (err) {
            console.error("Ошибка удаления поста:", err);
        }
    };

    const handleUpdatePost = async (
        postId: string,
        title: string,
        content: string
    ) => {
        if (!token) {
            return; // Прекращаем выполнение, если токен отсутствует
        }
        try {
            const response = await apiClient.put(
                `/posts/${postId}`,
                { title, content },
                {
                    headers: {
                        Authorization: ` ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Ответ от сервера:", response);
            if (response.data && response.data) {
                dispatch(updatePost(response.data));
            } else {
                console.error("Не удалось получить обновленный пост.");
            }
        } catch (err) {
            console.error("Ошибка обновления поста:", err);
        }
    };

    return {
        posts,
        loading,
        error,
        fetchPosts,
        createPost,
        handleDeletePost,
        handleUpdatePost,
    };
}
