"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Comments from "@/components/commentar/Comments";
import apiClient from "@/services/userApi";
import { LikeButton } from "@/components/like/LikeButton";
import { fetchLikes } from "@/store/slices/likeSlice";
import {AppDispatch} from "@/store/store";

interface Post {
    id: string;
    title: string;
    content: string;
}

export default function PostPage() {
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/posts/${id}`);
                setPost(response.data);

                // Загружаем актуальные лайки при загрузке страницы
                dispatch(fetchLikes());
            } catch {
                setError("Ошибка загрузки поста");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, dispatch]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold">{post?.title}</h1>
            <p>{post?.content}</p>
            <LikeButton postId={id as string} />
            <Comments postId={id as string} />
        </div>
    );
}
