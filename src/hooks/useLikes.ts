import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { toggleLike, fetchLikes } from "@/store/slices/likeSlice";

export default function useLikes(postId: string) {
    const dispatch = useDispatch<AppDispatch>();
    const likedPosts = useSelector((state: RootState) => state.likes.likedPosts);
    const loading = useSelector((state: RootState) => state.likes.status === "loading");
    const likeCounts = useSelector((state: RootState) => state.likes.likeCounts);

    const isLiked = likedPosts.includes(postId);
    const likeCount = likeCounts[postId] || 0;

    useEffect(() => {
        dispatch(fetchLikes());
    }, [dispatch]);

    const handleToggleLike = useCallback(() => {
        dispatch(toggleLike({ postId }));
    }, [dispatch, postId]);

    return { isLiked, handleToggleLike, loading, likeCount };
}
