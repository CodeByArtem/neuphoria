import { useState } from "react";
import useComments from "@/hooks/useComments";

interface CommentsProps {
    postId: string;
}

export default function Comments({ postId }: CommentsProps) {
    const {
        comments,
        loading,
        error,
        createComment,
        handleDeleteComment,
        handleUpdateComment,
    } = useComments(postId);

    const [newComment, setNewComment] = useState("");
    const [editMode, setEditMode] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        await createComment(newComment);
        setNewComment("");
    };

    const handleEditComment = async (commentId: string) => {
        if (!editContent.trim()) return;
        await handleUpdateComment(commentId, editContent);
        setEditMode(null);
    };

    return (
        <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Комментарии</h2>

            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="mb-4">
                <textarea
                    className="w-full border p-2 rounded"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Напишите комментарий..."
                />
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleAddComment}
                >
                    Добавить
                </button>
            </div>

            <ul className="space-y-4">
                {comments.map((comment) => (
                    <li key={comment.id} className="p-3 border rounded-lg">
                        {editMode === comment.id ? (
                            <div>
                                <textarea
                                    className="w-full border p-2 rounded"
                                    rows={2}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                                <button
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                                    onClick={() => handleEditComment(comment.id)}
                                >
                                    Сохранить
                                </button>
                                <button
                                    className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
                                    onClick={() => setEditMode(null)}
                                >
                                    Отмена
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p>{comment.content}</p>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                                        onClick={() => {
                                            setEditMode(comment.id);
                                            setEditContent(comment.content);
                                        }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
