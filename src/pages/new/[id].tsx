import { useRouter } from "next/router";

import "./newsDetail.scss";
import {news, NewsItem} from "@/services/news/news";
import Header from "@/components/heder/Header"; // Импортируем файл стилей

export default function NewsDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const item: NewsItem | undefined = news.find((n) => n.id === id);

    if (!item) return <p className="text-center mt-10">Новость не найдена</p>;

    return (
        <>
            <Header /> {/* Вставляем хедер сюда */}
        <div className="news-detail-container">
            <h1 className="news-detail-title">{item.title}</h1>
            <p className="news-detail-date">{item.date}</p>
            <p className="news-detail-content">{item.content}</p>
        </div>
            </>
    );
}
