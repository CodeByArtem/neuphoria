"use client";

import { useState } from "react";
import styles from "@/components/guide/guideCarusel.module.scss";

const rawVideos = [
    { url: "https://www.youtube.com/shorts/6687KdaR1mg", title: "Начало" },
    { url: "https://www.youtube.com/shorts/2AZwUuyBn3w", title: "Видео 2" },
    { url: "https://www.youtube.com/shorts/Rig1GkuoSuE", title: "Видео 3" },
    { url: "https://www.youtube.com/shorts/6687KdaR1mg", title: "Начало" },
    { url: "https://www.youtube.com/shorts/2AZwUuyBn3w", title: "Видео 2" },
    { url: "https://www.youtube.com/shorts/Rig1GkuoSuE", title: "Видео 3" },
    { url: "https://www.youtube.com/shorts/6687KdaR1mg", title: "Начало" },
    { url: "https://www.youtube.com/shorts/2AZwUuyBn3w", title: "Видео 2" },
    { url: "https://www.youtube.com/shorts/Rig1GkuoSuE", title: "Видео 3" }
];

// Преобразуем ссылки в формат embed с параметром nocookie
const videos = rawVideos.map(video => ({
    url: video.url.replace("shorts/", "embed/") + "?modestbranding=1&rel=0&autohide=1&showinfo=0",
    title: video.title
}));

export default function VideoCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextVideo = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    const prevVideo = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    };

    return (
        <div  id="guideHeader" className={styles.carousel}>
            <div className={styles.videoWrapper}>
                <button onClick={prevVideo} className={`${styles.navButton} ${styles.prevButton}`}>❮</button>
                <iframe
                    className={styles.video}
                    src={videos[currentIndex].url}
                    title={videos[currentIndex].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
                <button onClick={nextVideo} className={`${styles.navButton} ${styles.nextButton}`}>❯</button>
            </div>
            <div className={styles.videoList}>
                {videos.map((video, index) => (
                    <div
                        key={index}
                        className={`${styles.videoItem} ${index === currentIndex ? styles.active : ""}`}
                        onClick={() => setCurrentIndex(index)}
                    >
                        <span>{video.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
