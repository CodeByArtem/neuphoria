import "../style/globals.scss";

import Header from "@/components/heder/Header";
 import Hero from "@/components/hero/Hero";

 export default function Page() {
  return (
      <div className="min-h-screen bg-[url('/images/herofon.webp')] bg-cover bg-right -z-10">
     <Header/> {/* Используем компонент здесь */}
        <Hero/>
      </div>
  );
}