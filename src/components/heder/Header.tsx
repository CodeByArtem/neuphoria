"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setUser, clearUser } from "@/store/slices/authSlice";
import { getUserProfile } from "@/services/userApi";
import scss from "@/components/heder/Header.module.scss";
import LogoutButton from "@/components/btn/LogoutButton";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserProfile();
                if (userData?.email) {
                    dispatch(setUser({ user: userData, token: userData.token || "" }));
                }
            } catch (error) {
                setError("Ошибка загрузки профиля.");
                console.error("Ошибка загрузки пользователя:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(clearUser());
    };

    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Закрытие меню при клике вне области меню
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = document.querySelector(`.${scss.nav}`);
            const burgerButton = document.querySelector(`.${scss.burger}`);

            // Если клик был вне меню и кнопки бургера
            if (menu && burgerButton && !menu.contains(event.target as Node) && !burgerButton.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        // Добавляем событие на документ
        document.addEventListener('click', handleClickOutside);

        // Очищаем событие при размонтировании компонента
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <header className={scss.header}>
            <div className={scss.logo}>
                <Link href="/">
                    <Image
                        src="/icons/boblogo.webp"
                        alt="Логотип"
                        width={150}
                        height={100}
                        priority
                    />
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
