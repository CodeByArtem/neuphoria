import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setComments,
    setLoading,
    setError,
    addComment,
    deleteComment,
    updateComment,
} from "@/store/slices/commentsSlice";
import apiClient from "@/services/userApi";
import axios from "axios";

export default function useComments(postId: string) {
    const dispatch = useAppDispatch();
    const { comments, loading, error } = useAppSelector((state) => state.comments);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const [customError, setCustomError] = useState("");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const handleError = useCallback((message: string) => {
        dispatch(setError(message));
        setCustomError(message);
    }, [dispatch]);

    const fetchComments = useCallback(async () => {
        if (!token) return;
        dispatch(setLoading(true));

        try {
            const response = await apiClient.get(`/posts/${postId}/comments`, {
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
            });
            dispatch(setComments(response.data.comments || []));
            setCustomError("");
        } catch (err) {
            handleError("Ошибка загрузки комментариев");
            console.error("Error fetching comments:", err);
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, handleError, token, postId]);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchComments();
    }, [isAuthenticated, fetchComments]);

    const createComment = async (content: string) => {
        if (!token) return;

        try {
            const response = await apiClient.post(
                `/posts/${postId}/comments`,
                { content },
                {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data) {
                dispatch(addComment(response.data));
                return response.data;
            }

            handleError("Сервер не вернул созданный комментарий.");
            return { error: "Сервер не вернул созданный комментарий." };
        } catch (err) {
            let errorMsg = "Ошибка создания комментария";
            if (axios.isAxiosError(err) && err.response) {
                errorMsg = err.response.data?.message || errorMsg;
            }
            handleError(errorMsg);
            return { error: errorMsg };
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!token) return;

        try {
            await apiClient.delete(`/posts/${postId}/comments/${commentId}`, {
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
            });
            dispatch(deleteComment(commentId));
            setCustomError("");
        } catch {
            handleError("Ошибка удаления комментария");
        }
    };

    const handleUpdateComment = async (commentId: string, content: string) => {
        if (!token) return;

        try {
            const response = await apiClient.put(
                `/posts/${postId}/comments/${commentId}`,
                { content },
                {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data) {
                dispatch(updateComment(response.data));
                setCustomError("");
            } else {
                handleError("Не удалось получить обновленный комментарий.");
            }
        } catch {
            handleError("Ошибка обновления комментария");
        }
    };

    return {
        comments,
        loading,
        error,
        customError,
        fetchComments,
        createComment,
        handleDeleteComment,
        handleUpdateComment,
    };
}
