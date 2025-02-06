import "../style/globals.scss";

import Header from "@/components/heder/Header";
 import Hero from "@/components/hero/Hero";
import LatestNews from "@/components/news/News";
import ForumIntro from "@/components/forum/Forum";
import VideoCarousel from "@/components/guide/Guide";
import Footer from "@/components/footer/Footer";

 export default function Page() {
  return (
      <div>
          {/* Фон только для Header и Hero */}
          <div className="
  min-h-screen
  bg-[url('/images/herofon.webp')] bg-cover bg-right">


          <Header /> {/* Компонент Header с фоном */}
              <Hero  />
          </div>

          {/* Без фона для LatestNews */}
          <LatestNews />
          <ForumIntro/>
          <VideoCarousel/>
          <Footer/>
      </div>
  );
}