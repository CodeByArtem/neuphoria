"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, setUser } from "@/store/slices/authSlice";
import usePosts from "@/hooks/usePosts";

import { getUserProfile } from "@/services/api";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/btn/LogoutButton";

export default function Page() {
    const dispatch = useAppDispatch();
    const { posts, loading, createPost, handleDeletePost, handleUpdatePost } = usePosts();
    const user = useAppSelector((state) => state.auth.user);
    const [userLoading, setUserLoading] = useState(true);
    const [newPost, setNewPost] = useState({ title: "", content: "" });
    const [editPost, setEditPost] = useState<{ id: string | null; title: string; content: string }>({
        id: "", title: "", content: "",
    });
    const [postError, setPostError] = useState<string | null>(null);
    const [localPosts, setLocalPosts] = useState(posts);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                if (!token) {
                    setUserLoading(false);
                    return;
                }

                setUserLoading(true);
                const userData = await getUserProfile();
                if (userData) {
                    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                    dispatch(setUser({ user: userData, token: token as string }));
                }
            } catch (err) {
                console.error("Ошибка получения пользователя:", err);
            } finally {
                setUserLoading(false);
            }
        };

        if (!user) {
            fetchUser();
        } else {
            setUserLoading(false);
        }
    }, [user, dispatch]);

    useEffect(() => {
        setLocalPosts(posts);
    }, [posts]);

    const handleCreatePost = async () => {
        if (!newPost.title.trim() || !newPost.content.trim()) {
            setPostError("Заполните все поля для создания поста.");
            return;
        }

        const result = await createPost(newPost.title, newPost.content);

        if (result?.error) {
            setPostError(result.error);
        } else if (result) {
            setLocalPosts([result, ...localPosts]);
            setNewPost({ title: "", content: "" });
            setPostError(null);
        } else {
            setPostError("Неизвестная ошибка при создании поста.");
        }
    };

    const handleEditPost = (post: any) => {
        setEditPost({ id: post.id, title: post.title, content: post.content });
        setPostError(null);
    };

    const handleSaveEdit = async () => {
        if (editPost.id) {
            if (!editPost.title.trim() || !editPost.content.trim()) {
                setPostError("Заполните все поля для редактирования поста.");
                return;
            }
            try {
                await handleUpdatePost(editPost.id, editPost.title, editPost.content);
                setLocalPosts((prevPosts) => prevPosts.map(post => post.id === editPost.id ? { ...post, title: editPost.title, content: editPost.content } : post));
                setEditPost({ id: null, title: "", content: "" });
                setPostError(null);
            } catch (error) {
                console.error("Ошибка при обновлении поста:", error);
                setPostError("Ошибка при сохранении изменений.");
            }
        }
    };

    const DeletePost = async (postId: string) => {
        try {
            await handleDeletePost(postId);
            setLocalPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error("Ошибка при удалении поста:", error);
            setPostError("Ошибка при удалении поста.");
        }
    };



    const handleLogout = () => {
        dispatch(clearUser());
        localStorage.removeItem("token");
    };

    if (userLoading) return <p>Загрузка...</p>;
    if (!user) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-xl">Вы не авторизованы</p>
            <button
                className="bg-blue-600 text-white rounded px-4 py-2 mt-4"
                onClick={() => router.push("/auth")}
            >
                Войти
            </button>
            <button
                className="bg-green-600 text-white rounded px-4 py-2 mt-2"
                onClick={() => router.push("/auth/register")}
            >
                Зарегистрироваться
            </button>
        </div>
    );

    if (loading) return <p>Загрузка...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-blue-600">Forum</h3>
                <LogoutButton onClick={handleLogout} />
            </div>

            <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Создать новый пост</h4>
                <input
                    className="border rounded p-2 w-full mb-2"
                    type="text"
                    placeholder="Заголовок"
                    value={newPost.title}
                    onChange={(e) => {
                        setNewPost({ ...newPost, title: e.target.value });
                        setPostError(null);
                    }}
                />
                <textarea
                    className="border rounded p-2 w-full mb-2"
                    placeholder="Содержание"
                    value={newPost.content}
                    onChange={(e) => {
                        setNewPost({ ...newPost, content: e.target.value });
                        setPostError(null);
                    }}
                />
                {postError && <p className="text-red-600 mb-2">{postError}</p>}
                <button
                    className="bg-blue-600 text-white rounded px-4 py-2"
                    onClick={handleCreatePost}
                >
                    Создать пост
                </button>
            </div>

            <ul className="space-y-4">
                {localPosts.map((post) => (
                    post ? (
                        <li key={post?.id} className="border rounded-lg shadow-md p-4 bg-white">
                            {editPost && editPost.id && editPost.id === post?.id ? (
                                <>
                                    <input
                                        className="border rounded p-2 w-full mb-2"
                                        type="text"
                                        placeholder="Заголовок"
                                        value={editPost?.title}
                                        onChange={(e) => {
                                            setEditPost({ ...editPost, title: e.target.value });
                                            setPostError(null);
                                        }}
                                    />
                                    <textarea
                                        className="border rounded p-2 w-full mb-2"
                                        placeholder="Содержание"
                                        value={editPost?.content}
                                        onChange={(e) => {
                                            setEditPost({ ...editPost, content: e.target.value });
                                            setPostError(null);
                                        }}
                                    />

                                    {postError && <p className="text-red-600 mb-2">{postError}</p>}

                                    <button
                                        className="bg-green-600 text-white rounded px-4 py-2 mr-2"
                                        onClick={handleSaveEdit}
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        className="bg-gray-600 text-white rounded px-4 py-2"
                                        onClick={() => {
                                            setEditPost({ id: null, title: "", content: "" });
                                            setPostError(null);
                                        }}
                                    >
                                        Отмена
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h4 className="text-2xl font-semibold text-gray-800">
                                        {post?.title || 'Без названия'}
                                    </h4>
                                    <p className="text-gray-600 mt-2">{post?.content || 'Нет содержимого'}</p>
                                    <p className="text-sm text-gray-500 mt-4">
                                        Дата: {post?.createdAt ? (post.createdAt) : 'Неизвестно'}
                                    </p>
                                    {post?.authorId === user.id && (
                                        <>
                                            <button
                                                className="bg-yellow-600 text-white rounded px-4 py-2 mr-2"
                                                onClick={() => handleEditPost(post)}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                className="bg-red-600 text-white rounded px-4 py-2"
                                                onClick={() => DeletePost(post?.id)}
                                            >
                                                Удалить
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </li>
                    ) : null
                ))}
            </ul>
        </div>
    );
}
