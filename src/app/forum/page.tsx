"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, setUser } from "@/store/slices/authSlice";
import usePosts from "@/hooks/usePosts";
import LogoutButton from "@/components/btn/LogoutButton";
import { getUserProfile } from "@/services/api";
import { useRouter } from "next/navigation";

export default function Page() {
    const dispatch = useAppDispatch();
    const { posts, loading, createPost, handleDeletePost, handleUpdatePost } = usePosts();
    const user = useAppSelector((state) => state.auth.user);
    const [userLoading, setUserLoading] = useState(true);
    const [newPost, setNewPost] = useState({ title: "", content: "" });
    const [editPost, setEditPost] = useState({ id: "", title: "", content: "" });
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
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

    const handleCreatePost = async () => {
        await createPost(newPost.title, newPost.content);
        setNewPost({ title: "", content: "" });
    };

    const handleEditPost = (post: any) => {
        setEditPost({ id: post.id, title: post.title, content: post.content });
    };

    const handleSaveEdit = async () => {
        await handleUpdatePost(editPost.id, editPost.title, editPost.content);
        setEditPost({ id: "", title: "", content: "" });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
    };

    if (userLoading) return <p>Загрузка...</p>;
    if (!user) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-xl">Вы не авторизованы</p>
            <button
                className="bg-blue-600 text-white rounded px-4 py-2 mt-4"
                onClick={() => router.push("/login")}
            >
                Войти
            </button>
            <button
                className="bg-green-600 text-white rounded px-4 py-2 mt-2"
                onClick={() => router.push("/register")}
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
                <LogoutButton
                    onClick={() => {
                        // Очистить данные пользователя в Redux
                        dispatch(clearUser());

                        // Удалить токены из localStorage
                        localStorage.removeItem("token");
                        localStorage.removeItem('refreshToken');

                        // Удалить куки
                        document.cookie = 'token=; Max-Age=0; path=/';
                        document.cookie = 'refreshToken=; Max-Age=0; path=/';

                        // Перенаправление на главную страницу
                        router.push("/");
                    }}
                />
            </div>

            <div className="mb-6">
                <h4 className="text-xl font-semibold mb-2">Создать новый пост</h4>
                <input
                    className="border rounded p-2 w-full mb-2"
                    type="text"
                    placeholder="Заголовок"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <textarea
                    className="border rounded p-2 w-full mb-2"
                    placeholder="Содержание"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                <button
                    className="bg-blue-600 text-white rounded px-4 py-2"
                    onClick={handleCreatePost}
                >
                    Создать пост
                </button>
            </div>

            <ul className="space-y-4">
                {posts.map((post) => (
                    <li key={post.id} className="border rounded-lg shadow-md p-4 bg-white">
                        {editPost.id === post.id ? (
                            <>
                                <input
                                    className="border rounded p-2 w-full mb-2"
                                    type="text"
                                    placeholder="Заголовок"
                                    value={editPost.title}
                                    onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                                />
                                <textarea
                                    className="border rounded p-2 w-full mb-2"
                                    placeholder="Содержание"
                                    value={editPost.content}
                                    onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                                />
                                <button
                                    className="bg-green-600 text-white rounded px-4 py-2 mr-2"
                                    onClick={handleSaveEdit}
                                >
                                    Сохранить
                                </button>
                                <button
                                    className="bg-gray-600 text-white rounded px-4 py-2"
                                    onClick={() => setEditPost({ id: "", title: "", content: "" })}
                                >
                                    Отмена
                                </button>
                            </>
                        ) : (
                            <>
                                <h4 className="text-2xl font-semibold text-gray-800">{post.title}</h4>
                                <p className="text-gray-600 mt-2">{post.content}</p>
                                <p className="text-sm text-gray-500 mt-4">Дата: {formatDate(post.createdAt)}</p>
                                {post.authorId === user.id && (
                                    <>
                                        <button
                                            className="bg-yellow-600 text-white rounded px-4 py-2 mr-2"
                                            onClick={() => handleEditPost(post)}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="bg-red-600 text-white rounded px-4 py-2"
                                            onClick={() => handleDeletePost(post.id)}
                                        >
                                            Удалить
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
