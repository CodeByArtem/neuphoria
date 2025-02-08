"use client"
import styles from "./login.module.scss";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { setUser } from "@/store/slices/authSlice";


interface LoginResponse {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface ErrorResponse {
    message?: string;
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
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

            const { accessToken, user } = response.data;

            if (accessToken) {
                try {
                    localStorage.setItem("token", accessToken);
                    localStorage.setItem("user", JSON.stringify(user));
                } catch (err) {
                    console.error("Ошибка записи в localStorage", err);
                }

                dispatch(setUser({ user, token: accessToken }));
                await router.push("/");
            }
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;
            setError(axiosError.response?.data?.message || "Ошибка входа");
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

            {error && <div style={{ color: "red" }}>{error}</div>}

            <button className={styles.login} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Вход..." : "Login"}
            </button>
        </form>
    );
}
