import scss from '@/components/heder/Header.module.css';
import Link from "next/link";
import Image from "next/image";


export default function Header() {
    return (
        <header className={scss.header}>
            <div className={scss.logo}>
                <Link href="/">

                    <Image src="/icons/boblogo.webp" alt="logotip" width={150}  // Указываем фиксированную ширину
                           height={100}  // Для высоты не указываем явно, она будет автоматической
                           style={{height: 100, width: 150}}   priority={true}   />
                </Link>
            </div>
            <nav className={scss.nav}>
                <Link href="/">Главная</Link>
                <Link href="/new">Новости</Link>
                <Link href="/forum">Форум</Link>
                <Link href="/guide">Гайды</Link>
            </nav>
            <div className={scss.registr}>
                <Link href="/auth/register">Регистрация</Link>
                <Link href="/auth/login">Логин</Link>
            </div>
        </header>
    )
};