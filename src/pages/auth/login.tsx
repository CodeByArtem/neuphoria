import React, {useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await axios.post(
                "https://nestbackgame.onrender.com/api/auth/login",
                {email, password},
                {withCredentials: true}
            );

            // После успешного входа сервер отправит accessToken в куки
            await router.push("/forum/posts");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Ошибка входа");
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
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {error && <div style={{color: "red"}}>{error}</div>}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Войти"}
            </button>
        </form>
    );
}
