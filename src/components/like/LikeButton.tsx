import { useSelector, useDispatch } from "react-redux";
import { toggleLike } from "@/store/slices/likeSlice";
import { AppDispatch } from "@/store/store";

export function LikeButton({ postId }: { postId: string }) {
    const dispatch = useDispatch<AppDispatch>();
    const likedPosts = useSelector((state: any) => state.likes.likedPosts);
    const likeCount = useSelector((state: any) => state.likes.likeCounts[postId] || 0);

    const isLiked = likedPosts.includes(postId);

    const handleLike = () => {
        console.log("like", postId);
        dispatch(toggleLike({ postId }));
    };

    return (
        <button onClick={handleLike} className="mt-4 p-2 bg-blue-500 text-white rounded">
            {isLiked ? "❤️" : "🤍"} {likeCount}
        </button>
    );
}
