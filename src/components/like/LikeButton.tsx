import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {toggleLike} from "@/store/slices/likeSlice";


interface LikeButtonProps {
    postId: string;
}

export default function LikeButton({ postId }: LikeButtonProps) {
    const dispatch = useAppDispatch();
    const { likedPosts, status } = useAppSelector((state) => state.likes);

    const isLiked = likedPosts.includes(postId);
    const loading = status === "loading";

    return (
        <button
            onClick={() => dispatch(toggleLike({ postId }))}
            disabled={loading}
            className={`text-xl font-semibold transition-transform duration-300 ease-in-out ${
                isLiked ? "text-red-500 scale-110" : "text-gray-400 hover:scale-110"
            }`}
        >
            {isLiked ? "❤️ Лайкнуто" : "🤍 Лайкнуть"}
        </button>
    );
}