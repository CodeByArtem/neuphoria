import Link from "next/link";

import styles from "./News.module.scss";
import {news, NewsItem} from "@/services/news/news";

const LatestNews = () => {
    const latestNews: NewsItem[] = news.slice(0, 3);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Новости</h2>

            <h3 className={styles.subtitle}>Последние обновления</h3>
            <ul className={styles.newsList}>
                {latestNews.map((item) => (
                    <li key={item.id} className={styles.newsItem}>
                        <Link href={`/new/${item.id}`} className={styles.link}>
                            {item.title}
                        </Link>
                        <p className={styles.date}>{item.date}</p>
                    </li>
                ))}
            </ul>

            <div className={styles.viewAll}>
                <Link href="/new" className={styles.link}>
                    Смотреть все новости
                </Link>
            </div>
        </div>
    );
};

export default LatestNews;