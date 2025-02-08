"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";

const AuthLoader = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const savedAuth = localStorage.getItem("auth");
        if (savedAuth) {
            try {
                const { user, token } = JSON.parse(savedAuth);
                if (user && token) {
                    dispatch(setUser({ user, token }));
                }
            } catch (error) {
                console.error("Ошибка загрузки auth:", error);
            }
        }
    }, []);

    return null;
};

export default AuthLoader;
