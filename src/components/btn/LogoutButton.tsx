import { useRouter } from "next/router";
import {logout} from "@/services/api";
 // Путь может отличаться в зависимости от вашей структуры

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Вызываем функцию logout
            await logout();

            // Можно также перенаправить вручную, если требуется:
            // router.push("/login"); // Если не хотите использовать редирект в logout
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
