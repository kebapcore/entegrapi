
import { Code, ArrowRight, Cloud, Image, Zap, Globe, Database, Bot, Shield, MapPin, AudioLines, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/footer";

interface Statistics {
  requestsPerSecond: number;
  totalRequests: number;
  endpointCount: number;
  dailyRequests: number;
}

export default function HomePage() {
  const { t } = useLanguage();
  
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      } catch (error) {
        console.error('Stats API error:', error);
        return { success: false };
      }
    },
    refetchInterval: 2000, // Update every 2 seconds
    retry: false,
    staleTime: 1000,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section - Split Screen */}
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left Half - Black */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center min-h-[50vh] md:min-h-screen">
          <div className="text-center text-white px-8 py-12 md:py-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('header.title')}</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-md">
              {t('hero.subtitle')}
            </p>
            
            {/* Real-time Statistics */}
            {stats?.success && (
              <div className="bg-gray-900/50 rounded-lg p-6 mb-8 border border-gray-700">
                <div className="flex items-center justify-center mb-4">
                  <Activity className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold">Canlı Kullanım Oranları</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-red-500 font-bold text-lg">{stats.data.requestsPerSecond}</div>
                    <div className="text-gray-400 text-xs">{t('stats.requestsPerSecond')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-500 font-bold text-lg">{stats.data.totalRequests}</div>
                    <div className="text-gray-400 text-xs">{t('stats.totalRequests')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-500 font-bold text-lg">{stats.data.endpointCount}</div>
                    <div className="text-gray-400 text-xs">{t('stats.endpointCount')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-500 font-bold text-lg">{stats.data.dailyRequests}</div>
                    <div className="text-gray-400 text-xs">{t('stats.dailyRequests')}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <a 
                href="/docs" 
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('hero.getStarted')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Half - White */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center min-h-[50vh] md:min-h-screen">
          <div className="text-center md:text-left text-black px-8 py-12 md:py-8">
            <div className="grid gap-6 md:gap-8 max-w-md">
              <div className="text-left">
                <div className="flex items-center mb-3 justify-center md:justify-start">
                  <Bot className="w-6 h-6 mr-3 text-red-600" />
                  <h3 className="text-lg font-semibold">Yapay Zeka</h3>
                </div>
                <p className="text-gray-600 text-sm text-center md:text-left">
                  Gemini tabanlı metin analizi (Entegarla geliştirilmiş)
                </p>
              </div>
              
              <div className="text-left">
                <div className="flex items-center mb-3 justify-center md:justify-start">
                  <Database className="w-6 h-6 mr-3 text-red-600" />
                  <h3 className="text-lg font-semibold">Veri İşleme</h3>
                </div>
                <p className="text-gray-600 text-sm text-center md:text-left">
                  Wiki, YouTube ve web veri analizi
                </p>
              </div>
              
              <div className="text-left">
                <div className="flex items-center mb-3 justify-center md:justify-start">
                  <Zap className="w-6 h-6 mr-3 text-red-600" />
                  <h3 className="text-lg font-semibold">Hızlı ve Güvenli</h3>
                </div>
                <p className="text-gray-600 text-sm text-center md:text-left">
                  Video ve ses analizi gibi kompleks işlerde bile hızlı yanıtlar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Özellikler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İhtiyacınız olan her şey tek çatı altında. Entegar API'si ile projelerinizi güçlendirin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Cloud className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Hava Durumu</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Detaylı hava durumu bilgileri. Şehir ve ilçe bazında anlık veriler.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/weather?place=Istanbul,Kadıköy
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Image className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Görsel Üretimi</h3>
              </div>
              <p className="text-gray-600 mb-4">
                AI ile görsel oluşturma. Imagen ve Gemini modelleri ile.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/i/prompt=bir kedi?type=gemini
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Bot className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">AI Sohbet</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Yapay zeka ile metin analizi ve sohbet özellikleri.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/ai?prompt=Merhaba
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Web Analizi</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Web sayfalarından veri çekme ve analiz etme. İki tane websitesini karşılaştırma gibi kompleks işler.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/url?url=example.com
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Database className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Wikipedia</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Wikipedia verilerini alın.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/wiki?q=Einstein
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <MapPin className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">IP Analizi</h3>
              </div>
              <p className="text-gray-600 mb-4">
                IP adreslerinden konum, ISP ve detaylı bilgi analizi.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/ipcheck?ip=8.8.8.8
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">İçerik Moderasyonu</h3>
              </div>
              <p className="text-gray-600 mb-4">
                AI ile metin ve video içerik uygunluk kontrolü.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/check?v=https://cdn.com/pencizorno.mp4&type=yuzdeli
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <AudioLines className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Otomatik Altyazı</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ses dosyalarından zaman damgalı çoklu dilli gelişmiş altyazı üretimi.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/ai/autosub?myaudiolink=audio.mp3
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Daha Fazlası</h3>
              </div>
              <p className="text-gray-600 mb-4">
                YouTube, çeviri, TTS, video analiz, deprem verileri ve daha fazlası.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /docs
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
