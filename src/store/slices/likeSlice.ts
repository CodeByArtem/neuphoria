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

// Загрузка всех лайков
export const fetchLikes = createAsyncThunk(
    "likes/fetchLikes",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get("/like/posts/likes-count");
            return data;
        } catch {
            return rejectWithValue("Ошибка при загрузке лайков");
        }
    }
);

// Переключение лайка
export const toggleLike = createAsyncThunk(
    "likes/toggleLike",
    async (
        { postId }: { postId: string },
        { rejectWithValue, getState, dispatch }
    ) => {
        try {
            const state = getState() as { likes: LikeState };
            const isLiked = state.likes.likedPosts.includes(postId);

            const response = isLiked
                ? await apiClient.delete(`/like`, { data: { postId } })
                : await apiClient.post(`/like`, { postId });

            await dispatch(fetchLikes());

            return { postId, isLiked: !isLiked, likeCount: response.data.likeCount };
        } catch (error) {
            console.error("Ошибка лайка:", error);

            await dispatch(fetchLikes());

            return rejectWithValue("Ошибка при лайке");
        }
    }
);

const likesSlice = createSlice({
    name: "likes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchLikes.fulfilled,
                (state, action: PayloadAction<{ postId: string; likes: number }[]>) => {
                    state.likedPosts = action.payload
                        .filter((item) => item.likes > 0)
                        .map((item) => item.postId);

                    state.likeCounts = action.payload.reduce(
                        (acc: Record<string, number>, item) => {
                            acc[item.postId] = item.likes;
                            return acc;
                        },
                        {}
                    );

                    state.status = "succeeded";
                    state.error = null;
                }
            )
            .addCase(fetchLikes.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            .addCase(toggleLike.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(toggleLike.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default likesSlice.reducer;
