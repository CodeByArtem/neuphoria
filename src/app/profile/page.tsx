"use client"
import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { Button, Input } from "@/components/ui";
import { setUser, clearUser } from "@/store/slices/authSlice";
import styles from "@/app/profile/Profile.module.scss";
import { deleteUser, getUserProfile, updateUserProfile } from "@/services/api";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<{ email: string }>({ email: "" });
    const [userState, setUserState] = useState<{ email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Токен отсутствует");
                    return;
                }

                setError(null);  // Сбрасываем ошибку перед загрузкой
                const userData = await getUserProfile();

                if (userData?.email) {
                    dispatch(setUser({ user: userData, token }));
                    setFormData({ email: userData.email });
                    setUserState(userData);
                } else {
                    setError("Не удалось загрузить профиль");
                }
            } catch (e) {
                console.error("Ошибка при загрузке профиля:", e);
                setError("Ошибка загрузки профиля");
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
        try {
            await updateUserProfile(formData);
            setUserState({ email: formData.email });
        } catch (e) {
            console.error("Ошибка обновления профиля:", e);
            setError("Ошибка обновления профиля");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Вы уверены, что хотите удалить аккаунт?")) return;

        setDeleteLoading(true);
        try {
            await deleteUser();
            dispatch(clearUser());
            setUserState(null);
        } catch (e) {
            console.error("Ошибка удаления аккаунта:", e);
            setError("Ошибка удаления аккаунта");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return <p className={styles.loading}>Загрузка...</p>;
    }

    if (!userState) {
        return <p className={styles.error}>Вы не авторизованы</p>;
    }

    return (
        <div className={styles.profile}>
            <h2 className={styles.title}>Профиль</h2>
            {error && <div className={styles.error}>{error}</div>}
            <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                disabled
            />
            <Button
                onClick={handleSave}
                className={styles.button}
                disabled={loading || formData.email === userState.email}
            >
                Сохранить
            </Button>
            <Button
                onClick={handleDelete}
                className={styles.deleteButton}
                disabled={deleteLoading}
            >
                Удалить аккаунт
            </Button>
        </div>
    );
}
