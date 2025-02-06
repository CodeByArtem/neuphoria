import React, { useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

interface LoginResponse {
    accessToken: string;
}

interface ErrorResponse {
    message?: string;
}

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await axios.post<LoginResponse>(
                "https://nestbackgame.onrender.com/api/auth/login",
                { email, password },
                { withCredentials: true }
            );

            const token = response.data.accessToken;
            if (token) {
                localStorage.setItem("token", token);
            }

            await router.push("/forum/posts");
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;
            setError(axiosError.response?.data?.message || "Ошибка входа");
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

            {error && <div style={{ color: "red" }}>{error}</div>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Вход..." : "Войти"}
            </button>
        </form>
    );
}

