import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {AppDispatch, RootState} from "@/store/store";
import {toggleLike} from "@/store/slices/likeSlice";



export default function useLikes(postId: string) {
    const dispatch = useDispatch<AppDispatch>(); // типизируем dispatch
    const likedPosts = useSelector((state: RootState) => state.likes.likedPosts);
    const loading = useSelector((state: RootState) => state.likes.status === "loading");

    const isLiked = likedPosts.includes(postId);

    const handleToggleLike = useCallback(() => {
        dispatch(toggleLike({ postId }));
    }, [dispatch, postId]);

    return { isLiked, handleToggleLike, loading };
}
