"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import scss from "@/components/heder/Header.module.scss";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const handleBurgerClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && !(event.target as HTMLElement).closest(`.${scss.nav}`)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

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
                <Link className={scss.link} href="/auth/register">Регистрация</Link>
                <Link className={scss.link} href="/auth/login">Логин</Link>
            </div>
            <button
                className={`${scss.burger} ${isOpen ? scss.burgerHidden : ''}`}
                onClick={handleBurgerClick}
                aria-label="Открыть меню"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>
    );
}
