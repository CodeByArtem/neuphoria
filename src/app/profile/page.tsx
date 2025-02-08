"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { Button, Input } from "@/components/ui";
import { setUser, clearUser } from "@/store/slices/authSlice";
import styles from "@/app/profile/Profile.module.scss";
import { deleteUser, getUserProfile, updateUserProfile } from "@/services/userApi";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<{ email: string }>({ email: "" });
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (typeof window === "undefined") return;

        const fetchUser = async () => {
            setError("");
            try {
                const userData = await getUserProfile();
                if (userData?.email) {
                    dispatch(setUser({ user: userData, token: userData.token || "" }));
                    setFormData({ email: userData.email });
                    setUserState(userData);
                } else {
                    console.warn("Пользователь не найден");
                }
            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        setError("");
        try {
            await updateUserProfile(formData);
        } catch (error) {
            setError("Ошибка обновления профиля. Попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Вы уверены, что хотите удалить аккаунт?")) {
            setDeleteLoading(true);
            setError("");
            try {
                await deleteUser();
                dispatch(clearUser());
                setUserState(null);
            } catch (error) {
                setError("Ошибка удаления аккаунта. Попробуйте позже.");
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    if (loading) {
        return <p className={styles.loading}>Загрузка...</p>;
    }

    if (!user) {
        return <p className={styles.error}>Вы не авторизованы</p>;
    }

    return (
        <div className={styles.profile}>
            <h2 className={styles.title}>Профиль</h2>
            {error && <div className={styles.error}>{error}</div>}
            <Input name="email" value={formData.email} onChange={handleChange} className={styles.input} disabled />
            <Button onClick={handleSave} className={styles.button} disabled={!formData.email || loading}>Сохранить</Button>
            <Button onClick={handleDelete} className={styles.deleteButton} disabled={deleteLoading}>Удалить аккаунт</Button>
        </div>
    );
}
