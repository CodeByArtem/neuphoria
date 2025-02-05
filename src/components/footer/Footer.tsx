"use client";

import styles from "@/components/footer/footer.module.scss";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.contactInfo}>
                    <h3>Контактная информация</h3>
                    <p><strong>Телефон:</strong> +9 123 456 78 90</p>
                    <p><strong>Электронная почта:</strong> example@example.com</p>
                    <p><strong>Адрес:</strong> ул. каскад, д. 1, Польша</p>
                </div>

                <div className={styles.socialLinks}>
                    <h3>Следите за нами</h3>
                    <ul>
                        <li><a href="https://t.me/yourTelegram" target="_blank" rel="noopener noreferrer">Telegram</a></li>
                        <li><a href="https://twitter.com/yourTwitter" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                        <li><a href="https://www.instagram.com/yourInstagram" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    </ul>
                </div>

                <div className={styles.footerLegal}>
                    <p>© 2025 Company Name. Все права защищены.</p>
                    <nav>
                        <ul>
                            <li><a href="#privacyPolicy">Политика конфиденциальности</a></li>
                            <li><a href="#termsOfService">Условия использования</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
