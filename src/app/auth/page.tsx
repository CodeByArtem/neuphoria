"use client";
import styles from "./login.module.scss";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

interface LoginResponse {
    accessToken: string;
}

interface ErrorResponse {
    message?: string | string[];  // Массив или строка
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            console.log("Attempting login with:", { email, password });

            const { data } = await axios.post<LoginResponse>(
                "https://nestbackgame.onrender.com/api/auth/login",
                { email, password },
                { withCredentials: true }
            );

            console.log("Login successful, server response:", data);

            const { accessToken } = data;

            if (accessToken) {
                try {
                    localStorage.setItem("token", accessToken);
                    console.log("Token saved to localStorage");
                } catch (err) {
                    console.error("Error saving token to localStorage:", err);
                }

                // Перенаправляем на другую страницу
                await router.push("/"); // Перенаправление на главную страницу
            }
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;

            // Проверяем, если есть ошибка, показываем сообщение пользователю
            if (axiosError.response) {
                const errorMessage = Array.isArray(axiosError.response?.data?.message)
                    ? axiosError.response?.data?.message[0]
                    : axiosError.response?.data?.message;

                // Показываем ошибку на странице
                setError(errorMessage || "Ошибка входа");
            } else {
                setError("Неизвестная ошибка, попробуйте позже");
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <form className={styles["login-form"]} onSubmit={handleSubmit}>
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

            {error && <div style={{ color: "red" }}>{error}</div>}  {/* Вывод ошибки */}

            <button className={styles.login} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Вход..." : "Login"}
            </button>
        </form>
    );
}
