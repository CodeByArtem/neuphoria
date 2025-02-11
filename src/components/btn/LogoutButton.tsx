import { logoutUser } from "@/services/api";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store"; // Импортируем dispatch

interface LogoutButtonProps {
    onClick: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = async () => {
        // Выполняем логаут через запрос и dispatch для очистки данных
        await logoutUser(dispatch);
        onClick(); // Вызовем onClick, переданный как пропс
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
