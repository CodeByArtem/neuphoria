"use client";
import { useEffect, useState } from "react";
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
import axios from "axios";

export default function usePosts() {
    const dispatch = useAppDispatch();
    const { posts, loading, error } = useAppSelector((state) => state.posts);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [customError, setCustomError] = useState("");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (!isAuthenticated) {
            handleError("Token is missing");
            return;
        }
        fetchPosts();
    }, [dispatch, isAuthenticated]);

    const handleError = (message: string) => {
        dispatch(setError(message));
        setCustomError(message);
    };

    const fetchPosts = async () => {
        if (!token) return;
        dispatch(setLoading(true));

        try {
            const response = await apiClient.get("/posts", {
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
            });
            dispatch(setPosts(response.data.posts || []));
            setCustomError("");
        } catch (err) {
            handleError("Ошибка загрузки постов");
            console.error("Error fetching posts:", err);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createPost = async (title: string, content: string) => {
        if (!token) return;

        try {
            const response = await apiClient.post(
                "/posts",
                { title, content },
                {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const createdPost = response.data;

            if (createdPost) {
                dispatch(addPost(createdPost));
                return createdPost;
            }

            const errorMsg = "Сервер не вернул созданный пост.";
            handleError(errorMsg);
            return { error: errorMsg };
        } catch (err: any) {
            let errorMsg = "Неизвестная ошибка";

            if (axios.isAxiosError(err) && err.response) {
                const { status, data } = err.response;
             

                if (status === 400 && data?.message?.includes("Please wait")) {
                    errorMsg = data.message;
                } else {
                    errorMsg = data?.message || "Ошибка создания поста";
                }
            }

            handleError(errorMsg);
            return { error: errorMsg }; // Возвращаем ошибку
        }
    };


    const handleDeletePost = async (postId: string) => {
        if (!token) return;

        try {
            await apiClient.delete(`/posts/${postId}`, {
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
            });
            dispatch(deletePost(postId));
            setCustomError("");
        } catch (err) {
            handleError("Ошибка удаления поста");

        }
    };

    const handleUpdatePost = async (postId: string, title: string, content: string) => {
        if (!token) return;

        try {
            const response = await apiClient.put(
                `/posts/${postId}`,
                { title, content },
                {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data) {
                dispatch(updatePost(response.data));
                setCustomError("");
            } else {
                handleError("Не удалось получить обновленный пост.");
            }
        } catch (err) {
            handleError("Ошибка обновления поста");

        }
    };

    return {
        posts,
        loading,
        error,
        customError,
        fetchPosts,
        createPost,
        handleDeletePost,
        handleUpdatePost,
    };
}
