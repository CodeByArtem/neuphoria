import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Тип для поста
export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    likesCount: number;
    createdAt: string;
}

// Начальное состояние
interface PostsState {
    posts: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    posts: [],
    loading: false,
    error: null,
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        addPost: (state, action: PayloadAction<Post>) => {
            state.posts.unshift(action.payload);
        },
        deletePost: (state, action: PayloadAction<string>) => {
            state.posts = state.posts.filter(
                (post) => post.id !== action.payload
            );
        },
        updatePost: (state, action: PayloadAction<Post>) => {

            const index = state.posts.findIndex(
                (post) => post.id === action.payload.id
            );
            if (index !== -1) {
                // Обновляем пост по его id
                state.posts[index] = action.payload;
            } else {
                console.error("Пост с таким id не найден.");
            }
        },


    },
});

export const {
    setPosts,
    setLoading,
    setError,
    addPost,
    deletePost,
    updatePost,
} = postsSlice.actions;
export default postsSlice.reducer;
