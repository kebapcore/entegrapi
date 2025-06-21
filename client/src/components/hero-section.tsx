
import { ArrowRight, Code, Zap, Shield, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const phrases = [
    "Yapay Zeka API'leri",
    "Video Analizi",
    "Sesli İçerik Üretimi",
    "Deprem Verileri",
    "Gerçek Zamanlı Veriler"
  ];

  useEffect(() => {
    const currentPhrase = phrases[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentPhrase.length) {
          setTypedText(currentPhrase.slice(0, typedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(typedText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [typedText, currentIndex, isDeleting]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="fade-in">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Güçlü API Çözümleri
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-white mb-2">Entegar</span>
            <span className="text-gradient neon-glow">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed">
            Modern uygulamalarınız için <strong className="text-emerald-400">yapay zeka</strong>, 
            <strong className="text-blue-400"> video analizi</strong>, 
            <strong className="text-violet-400"> veri işleme</strong> ve 
            <strong className="text-orange-400"> gerçek zamanlı API'ler</strong>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a 
              href="/docs" 
              className="btn-primary group"
            >
              Hemen Başla
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#apis" 
              className="btn-secondary group"
            >
              <Code className="mr-2 w-5 h-5" />
              API'leri Keşfet
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-effect rounded-xl p-6 hover-scale">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Hızlı Entegrasyon</h3>
              <p className="text-slate-400 text-sm">
                Tek satır kodla güçlü AI özelliklerini uygulamanıza entegre edin
              </p>
            </div>

            <div className="glass-effect rounded-xl p-6 hover-scale">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Güvenilir</h3>
              <p className="text-slate-400 text-sm">
                %99.9 uptime garantisi ile 7/24 kesintisiz hizmet
              </p>
            </div>

            <div className="glass-effect rounded-xl p-6 hover-scale">
              <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Globe className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Küresel Erişim</h3>
              <p className="text-slate-400 text-sm">
                Dünya çapında CDN ağı ile düşük gecikme süresi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
