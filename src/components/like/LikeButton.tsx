import { useSelector, useDispatch } from "react-redux";
import { toggleLike } from "@/store/slices/likeSlice";
import { AppDispatch, RootState } from "@/store/store";

interface LikeButtonProps {
    postId: string;
}

export function LikeButton({ postId }: LikeButtonProps) {
    const dispatch = useDispatch<AppDispatch>();
    const likedPosts = useSelector((state: RootState) => state.likes.likedPosts);
    const likeCount = useSelector((state: RootState) => state.likes.likeCounts[postId] || 0);

    const isLiked = likedPosts.includes(postId);

    const handleLike = () => {
        dispatch(toggleLike({ postId }));
    };

    return (
        <button onClick={handleLike} className="mt-4 p-2 bg-blue-500 text-white rounded">
            {isLiked ? "❤️" : "🤍"} {likeCount}
        </button>
    );
}
