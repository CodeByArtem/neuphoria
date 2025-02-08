"use client"

import Link from "next/link";
import styles from '@/components/forum/Forum.module.scss';

export default function ForumIntro() {
    return (
        <div className={styles.forumIntro}>
            <div className={styles.forumContent}>
                <div className={styles.leftHalf}>
                    <h3 className={styles.forumTitle}>Добро пожаловать на наш форум!</h3>
                    <p className={styles.forumDescription}>
                        Здесь можно обсуждать любые темы, задавать вопросы и находить единомышленников.
                    </p>
                    <div className={styles.buttonsContainer}>
                        <Link href="/login" className={styles.forumButton}>Войти</Link>
                        <Link href="/register" className={styles.forumButton}>Регистрация</Link>
                    </div>
                </div>
                <div className={styles.rightHalf}>
                    <div className={styles.card}>
                        <p>Информация о форуме</p>
                        <p>Здесь вы найдете обсуждения по множеству интересных тем!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
