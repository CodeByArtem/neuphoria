import { logoutUser } from "@/services/api";
import React from "react";

interface LogoutButtonProps {
    onClick: () => void;
}


const LogoutButton: React.FC<LogoutButtonProps> = () => {
    const handleLogout = async () => {
        await logoutUser();
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
