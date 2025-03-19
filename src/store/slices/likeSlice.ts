import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/services/userApi";

interface LikeData {
    postId: string;
    likes: number;
}

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
export const fetchLikes = createAsyncThunk<LikeData[], void, { rejectValue: string }>(
    "likes/fetchLikes",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get("/like/posts/likes-count");
            return data;
        } catch (err) {
            return rejectWithValue("Ошибка при загрузке лайков");
        }
    }
);

// Переключение лайка
export const toggleLike = createAsyncThunk<
    { postId: string; isLiked: boolean; likeCount: number },
    { postId: string },
    { rejectValue: string; state: { likes: LikeState } }
>(
    "likes/toggleLike",
    async ({ postId }, { rejectWithValue, getState, dispatch }) => {
        try {
            const state = getState();
            const isLiked = state.likes.likedPosts.includes(postId);

            const response = isLiked
                ? await apiClient.delete(`/like`, { data: { postId } })
                : await apiClient.post(`/like`, { postId });

            console.log("Ответ сервера после лайка:", response);

            // Сразу после лайка подгружаем актуальные данные
            await dispatch(fetchLikes());

            return { postId, isLiked: !isLiked, likeCount: response.data.likeCount };
        } catch (err: unknown) {
            const error = err as { response?: { status?: number; data?: any }; message?: string };

            console.error(
                "Ошибка лайка:",
                error.response?.status || "нет статуса",
                error.response?.data || error.message || "неизвестная ошибка"
            );

            // Принудительное обновление лайков даже при ошибке
            await dispatch(fetchLikes());

            return rejectWithValue(error.response?.data?.message || "Ошибка при лайке");
        }
    }
);

const likesSlice = createSlice({
    name: "likes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Обработка успешного получения лайков
            .addCase(fetchLikes.fulfilled, (state, action: PayloadAction<LikeData[]>) => {
                console.log("Данные лайков с бэка:", action.payload);

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
            })
            .addCase(fetchLikes.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            // Лайк с обновлением данных
            .addCase(toggleLike.fulfilled, (state) => {
                state.status = "succeeded";
            })

            // Обработка ошибок при лайке
            .addCase(toggleLike.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default likesSlice.reducer;
