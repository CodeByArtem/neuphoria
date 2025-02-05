import Link from "next/link";

import "./news.scss";
import {news, NewsItem} from "@/services/news/news";
import Header from "@/components/heder/Header"; // Импортируем файл стилей

export default function NewsPage() {
    return (
        <>
            <Header /> {/* Вставляем хедер сюда */}
            <div className="news-container">
                <h1 className="news-title">Новости сайта</h1>
                <ul className="news-list">
                    {news.map((item: NewsItem) => (
                        <li key={item.id} className="news-item">
                            <Link href={`/new/${item.id}`} className="news-link">
                                {item.title}
                            </Link>
                            <p className="news-date">{item.date}</p>
                            <p className="news-summary">{item.summary}</p> {/* Здесь выводится краткое описание */}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}