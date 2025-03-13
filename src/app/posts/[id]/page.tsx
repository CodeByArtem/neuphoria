"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Comments from "@/components/commentar/Comments";
import apiClient from "@/services/userApi";

// Описываем тип поста
interface Post {
    id: string;
    title: string;
    content: string;
}

export default function PostPage() {
    const params = useParams();
    const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            try {
                const response =  await apiClient.get(`/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                setError("Ошибка загрузки поста");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold">{post?.title}</h1>
            <p>{post?.content}</p>
            <Comments postId={id as string} />
        </div>
    );
}
