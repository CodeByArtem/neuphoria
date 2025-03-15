import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/userApi";

interface LikeState {
    likedPosts: string[];
    likeCounts: Record<string, number>;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: LikeState = {
    likedPosts: [],
    likeCounts: {},
    status: "idle",
    error: null,
};

// Thunk для переключения лайка
export const toggleLike = createAsyncThunk(
    "likes/toggleLike",
    async ({ postId }: { postId: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { likes: LikeState };
            const isLiked = state.likes.likedPosts.includes(postId);

            let updatedCount = state.likes.likeCounts[postId] || 0;

            if (isLiked) {
                await apiClient.delete(`/like`, { data: { postId } });
                updatedCount--;
            } else {
                await apiClient.post(`/like`, { postId });
                updatedCount++;
            }

            return { postId, updatedCount, isLiked: !isLiked };
        } catch (err) {
            console.error("Ошибка запроса:", err);
            return rejectWithValue("Ошибка при лайке");
        }
    }
);

const likeSlice = createSlice({
    name: "likes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(toggleLike.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                state.status = "succeeded";
                const { postId, updatedCount, isLiked } = action.payload;

                state.likeCounts[postId] = updatedCount;

                if (isLiked) {
                    state.likedPosts.push(postId);
                } else {
                    state.likedPosts = state.likedPosts.filter((id) => id !== postId);
                }
            })
            .addCase(toggleLike.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export default likeSlice.reducer;
