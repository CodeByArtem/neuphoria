
import Link from "next/link";
import scss from "@/components/hero/Hero.module.scss";
import { FaGooglePlay } from 'react-icons/fa';  // Иконка Google Play
import { FaAppStore } from 'react-icons/fa';    // Иконка App Store

export default function Hero() {
    return (
        <section className={scss.heroSection}>
            <div className={scss.heroContainer}>
                <h1 className={scss.heroTitle}>Погрузись в мир приключений</h1>
                <p className={scss.heroText}>Стань частью захватывающей истории прямо сейчас!</p>
                <Link href="https://play.google.com/store/apps/details?id=com.Eclipse.Neuphoria" className={`${scss.heroBtn} ${scss.googlePlay}`} target="_blank" rel="noopener noreferrer">
                    <FaGooglePlay className={scss.icon} /> Скачать в Google Play
                </Link>
                <Link href="https://apps.apple.com/ph/app/neuphoria/id6444274471" className={`${scss.heroBtn} ${scss.appStore}`} target="_blank" rel="noopener noreferrer">
                    <FaAppStore className={`${scss.icon} ${scss.iconapp}`} /> Скачать в App Store
                </Link>
            </div>
        </section>
    );
}
