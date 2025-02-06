import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Типизация данных формы
interface LoginData {
    email: string;
    password: string;
}

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(""); // Сбрасываем ошибку при новом отправлении формы

        try {
            const response = await axios.post(
                "https://nestbackgame.onrender.com/api/auth/login",
                { email, password },
                { withCredentials: true }
            );

            // После успешного входа сервер отправит accessToken в куки
            const token = response.data.accessToken;
            if (token) {
                localStorage.setItem("token", token); // Сохраняем токен
            }

            await router.push("/forum/posts"); // Перенаправление на страницу постов
        } catch (err) {
            // Добавляем проверку типа ошибки, если response есть
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || "Ошибка входа");
            } else {
                setError("Неизвестная ошибка");
            }
        } finally {
            setIsSubmitting(false); // Завершаем процесс отправки формы
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {error && <div style={{ color: "red" }}>{error}</div>}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Войти"}
            </button>
        </form>
    );
}
