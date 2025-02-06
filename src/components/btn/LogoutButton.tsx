import { logout } from "@/services/api"; // Путь может отличаться

const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Ошибка логаута", error);
        }
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
