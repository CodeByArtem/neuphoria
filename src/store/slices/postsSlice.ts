import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Определим тип для поста
interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}

// Определим начальное состояние
interface PostsState {
    posts: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    posts: [],
    loading: true,
    error: null,
};

// Создадим slice
const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts(state, action: PayloadAction<Post[]>) {
            state.posts = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

// Экспорты
export const { setPosts, setLoading, setError } = postsSlice.actions;
export default postsSlice.reducer;
