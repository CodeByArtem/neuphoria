import "../style/globals.scss";

import Header from "@/components/heder/Header";
 import Hero from "@/components/hero/Hero";
import LatestNews from "@/components/news/News";

 export default function Page() {
  return (
      <div>
          {/* Фон только для Header и Hero */}
          <div className="min-h-screen bg-[url('/images/herofon.webp')] bg-cover bg-right -z-10
  sm:bg-center sm:bg-auto sm:bg-no-repeat sm:min-h-[50vh] md:bg-cover md:bg-center md:min-h-screen">


          <Header /> {/* Компонент Header с фоном */}
              <Hero  />
          </div>

          {/* Без фона для LatestNews */}
          <LatestNews />
      </div>
  );
}