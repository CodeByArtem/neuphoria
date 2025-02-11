"use client"

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setUser, clearUser } from "@/store/slices/authSlice";
import scss from "@/components/heder/Header.module.scss";
import LogoutButton from "@/components/btn/LogoutButton";
import { getUserProfile } from "@/services/api";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Функция для загрузки профиля пользователя
    const fetchUser = async () => {
        setLoading(true);
        try {
            // Загружаем данные пользователя
            const userData = await getUserProfile();
            console.log("Полученные данные пользователя:", userData); // Логируем данные

            if (userData?.email) {
                const token = localStorage.getItem("token") as string;
                dispatch(setUser({ user: userData, token }));
            } else {
                console.log("Не удалось получить email из профиля.");
            }
        } catch (error) {
            setError("Ошибка загрузки профиля.");
            console.error("Ошибка загрузки пользователя:", error);
        } finally {
            setLoading(false);
        }
    };

    // Вызов функции при загрузке компонента
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            fetchUser();
        } else {
            console.log("Токен не найден.");
        }
    }, [dispatch]);

    // Обработчик выхода
    const handleLogout = () => {
        dispatch(clearUser());
        localStorage.removeItem("token"); // Удаляем токен
    };

    // Функция для открытия/закрытия меню
    const toggleMenu = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    // Обработчик клика за пределами меню для его закрытия
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = document.querySelector(`.${scss.nav}`);
            const burgerButton = document.querySelector(`.${scss.burger}`);

            if (menu && burgerButton && !menu.contains(event.target as Node) && !burgerButton.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <header className={scss.header}>
            <div className={scss.logo}>
                <Link href="/">
                    <Image src="/icons/boblogo.webp" alt="Логотип" width={150} height={100} priority />
                </Link>
            </div>
            <nav className={`${scss.nav} ${isOpen ? scss.open : ""}`}>
                <Link href="/" onClick={() => setIsOpen(false)}>Главная</Link>
                <Link href="/new" onClick={() => setIsOpen(false)}>Новости</Link>
                <Link href="/forum" onClick={() => setIsOpen(false)}>Форум</Link>
                <Link href="#guideHeader" onClick={() => setIsOpen(false)}>Гайды</Link>
            </nav>
            <div className={scss.registr}>
                {loading ? (
                    <span>Загрузка...</span>
                ) : error ? (
                    <span className={scss.error}>{error}</span>
                ) : user ? (
                    <div className={scss.userBlock}>
                        <span className={scss.userName}>{user.email}</span>
                        <LogoutButton onClick={handleLogout} />
                    </div>
                ) : (
                    <>
                        <Link className={scss.link} href="/auth/register">Регистрация</Link>
                        <Link className={scss.link} href="/auth">Логин</Link>
                    </>
                )}
            </div>
            <button
                className={`${scss.burger} ${isOpen ? scss.burgerHidden : ''}`}
                onClick={toggleMenu}
                aria-label="Открыть меню"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>
    );
}
