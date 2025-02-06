import React, { useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

interface RegisterResponse {
    message: string;
}

interface ErrorResponse {
    message: string;
}

export default function Register() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordRepeat, setPasswordRepeat] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        if (password !== passwordRepeat) {
            setError("Пароли не совпадают");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post<RegisterResponse>(
                "https://nestbackgame.onrender.com/api/auth/register",
                { email, password, username },
                { withCredentials: true }
            );

            console.log("Registration success:", response.data);
            await router.push("/auth/login");
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;
            setError(axiosError?.response?.data?.message || "Ошибка регистрации");
        } finally {
            setIsSubmitting(false);
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
                <label>Пароль</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Повторите пароль</label>
                <input
                    type="password"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Имя пользователя</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            {error && <div style={{ color: "red" }}>{error}</div>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
            </button>
        </form>
    );
}
