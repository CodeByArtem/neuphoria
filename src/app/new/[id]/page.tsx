"use client"

import { useParams } from "next/navigation";

import "./newsDetail.scss";

import Header from "@/components/heder/Header";
import {news, NewsItem} from "@/services/news/news"; // Импортируем файл стилей

export default function NewsDetailPage() {
    const params = useParams();
    const newsId = params.id;
    const item: NewsItem | undefined = news.find((n) => n.id === newsId);

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
