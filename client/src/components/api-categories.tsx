import { AlertTriangle, Brain, Volume2, Database, Globe, Book, Youtube, Film, DollarSign } from "lucide-react";

const API_BASE_URL = "https://entegar.netlify.app";

export default function ApiCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* AI APIs Section */}
        <div id="ai-apis" className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
              <Brain className="text-blue-600 w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Yapay Zeka API'leri</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Google Gemini modelleri ile güçlendirilmiş yapay zeka servisleri
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Text Generation API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Brain className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Metin Üretimi</h3>
                  <p className="text-slate-600">Gemini AI ile gelişmiş metin üretimi</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/ai</div>
                  <div className="text-slate-300">
                    ?query=<span className="text-yellow-300">Türkiye'nin başkenti nedir</span><br/>
                    &model=<span className="text-yellow-300">gemini-2.5-flash</span><br/>
                    &system=<span className="text-yellow-300">Sen yararlı bir asistandsın</span><br/>
                    &image=<span className="text-yellow-300">https://example.com/image.jpg</span> <span className="text-slate-500">(opsiyonel)</span><br/>
                    &key=<span className="text-yellow-300">your_api_key</span> <span className="text-slate-500">(opsiyonel)</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "response": "Türkiye'nin başkenti Ankara'dır.",
    "model": "gemini-2.5-flash",
    "usage": {
      "input_tokens": 15,
      "output_tokens": 8
    }
  }
}`}</code></pre>
              </div>
              <p className="mt-2 text-sm text-gray-500">Imagen ücretlidir ve bizim default keyimiz bunu kullanamaz. Varsa kendi üst seviye Gemini keyinizi ekleyerek kullanabilirsiniz.</p>
            </div>

            {/* Text-to-Speech API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                  <Volume2 className="text-emerald-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Metin-Ses Dönüşümü</h3>
                  <p className="text-slate-600">Gemini TTS ile ses üretimi</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/ai/tts</div>
                  <div className="text-slate-300">
                    ?query=<span className="text-yellow-300">Merhaba, bugün nasılsınız?</span><br/>
                    &name=<span className="text-yellow-300">Zephyr</span><br/>
                    &key=<span className="text-yellow-300">your_api_key</span> <span className="text-slate-500">(opsiyonel)</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "audio_url": "data:audio/wav;base64,UklGRnoG...",
    "duration": 2.5,
    "voice": "Kore",
    "text": "Merhaba, bugün nasılsınız?"
  }
}`}</code></pre>
              </div>
              <p className="mt-2 text-sm text-gray-500">Bütün isimler için <a href="#ek-notlar">tıklayın</a>.</p>
            </div>

            {/* URL Context API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="text-purple-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">URL İçerik Analizi</h3>
                  <p className="text-slate-600">Web sitelerini Gemini ile analiz et</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/ai/urlcontext</div>
                  <div className="text-slate-300">
                    ?q=<span className="text-yellow-300">Bu sitedeki ana konuları özetle: https://example.com</span><br/>
                    &model=<span className="text-yellow-300">gemini-2.5-flash</span><br/>
                    &key=<span className="text-yellow-300">your_api_key</span> <span className="text-slate-500">(opsiyonel)</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "response": "Site ana konuları: teknoloji...",
    "model": "gemini-2.5-flash",
    "url_metadata": {...}
  }
}`}</code></pre>
              </div>
            </div>

            {/* Translation API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="text-indigo-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Çeviri</h3>
                  <p className="text-slate-600">Gemini AI ile akıllı çeviri</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/translate</div>
                  <div className="text-slate-300">
                    ?q=<span className="text-yellow-300">Merhaba dünya</span><br/>
                    &to=<span className="text-yellow-300">english</span><br/>
                    &key=<span className="text-yellow-300">your_api_key</span> <span className="text-slate-500">(opsiyonel)</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "original_text": "Merhaba dünya",
    "translated_text": "Hello world",
    "source_language": "auto",
    "target_language": "english"
  }
}`}</code></pre>
              </div>
            </div>

            {/* Currency API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Döviz + AI</h3>
                  <p className="text-slate-600">Kur bilgileri & analiz</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/currency</div>
                  <div className="text-slate-300">
                    ?q=<span className="text-yellow-300">USD</span><br/>
                    &to=<span className="text-yellow-300">TL</span><br/>
                    &ai=<span className="text-yellow-300">Bu kur hakkında analiz yap</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "from": "USD",
    "to": "TRY",
    "rate": 33.45,
    "date": "2024-01-15"
  },
  "ai_answer": "Kur trend analizi..."
}`}</code></pre>
              </div>
            </div>

            {/* Earthquake API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <AlertTriangle className="text-red-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Deprem Verileri</h3>
                  <p className="text-slate-600">Güncel deprem bilgileri</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/earthquake/latest</div>
                  <div className="text-slate-300">
                    ?country=<span className="text-yellow-300">tr</span><br/>
                    &ai=<span className="text-yellow-300">Bu depremi analiz et</span>
                  </div>
                  <div className="text-green-400 mb-2 mt-3">{API_BASE_URL}/api/earthquake/last</div>
                  <div className="text-slate-300">
                    ?country=<span className="text-yellow-300">turkey</span><br/>
                    &limit=<span className="text-yellow-300">20</span><br/>
                    &ai=<span className="text-yellow-300">Depremleri analiz et</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Özellikler</h4>
                <div className="space-y-2 text-sm">
                  <div>• Son deprem bilgisi</div>
                  <div>• Son N deprem listesi (1-50)</div>
                  <div>• Büyüklük, konum, zaman bilgileri</div>
                  <div>• AI ile deprem analizi</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media APIs Section */}
        <div id="data-apis">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-4">
              <Database className="text-emerald-600 w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Veri Çekme API'leri</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Wikipedia, TDK, YouTube, Film ve Döviz kurları ile AI analiz desteği
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Wikipedia API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="text-orange-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Wikipedia + AI</h3>
                  <p className="text-slate-600">Ansiklopedi verileri & analiz</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/wiki</div>
                  <div className="text-slate-300">
                    ?q=<span className="text-yellow-300">Einstein</span><br/>
                    &type=<span className="text-yellow-300">wikiquote</span><br/>
                    &lang=<span className="text-yellow-300">en</span><br/>
                    &ai=<span className="text-yellow-300">Bu alıntıları analiz et</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "title": "Albert Einstein",
    "summary": "Einstein quotes...",
    "type": "wikiquote"
  },
  "ai_answer": "Einstein'in sözleri..."
}`}</code></pre>
              </div>
            </div>

            {/* TDK API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Book className="text-red-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">TDK Sözlük</h3>
                  <p className="text-slate-600">Kelime anlamları</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/tdk</div>
                  <div className="text-slate-300">
                    ?query=<span className="text-yellow-300">bilgisayar</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "word": "bilgisayar",
    "meanings": [
      {
        "definition": "Çok sayıda aritmetik...",
        "type": "isim"
      }
    ]
  }
}`}</code></pre>
              </div>
            </div>

            {/* YouTube Video API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Youtube className="text-red-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">YouTube Video</h3>
                  <p className="text-slate-600">Video bilgileri</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/yt</div>
                  <div className="text-slate-300">
                   ?url=<span className="text-yellow-300">https://www.youtube.com/watch?v=VIDEO_ID</span>
                  </div>
                   <p className="mt-2 text-sm text-gray-500">yt-dlp -g -f bestvideo+bestaudio "https://www.youtube.com/watch?v=VIDEO_ID" komutu ile mp3_url ve mp4_url alabilirsiniz.</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "title": "Video Title",
    "thumbnail": "https://...",
    "author": "Channel Name",
    "channel": {
      "name": "Channel Name",
      "avatar": "https://...",
      "description": "..."
    }
  }
}`}</code></pre>
              </div>
            </div>

            {/* Movie API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Film className="text-purple-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Film + AI</h3>
                  <p className="text-slate-600">IMDb verileri & analiz</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/movie</div>
                  <div className="text-slate-300">
                    ?q=<span className="text-yellow-300">Interstellar</span><br/>
                    &ai=<span className="text-yellow-300">Bu filmin puanlarına bakarak ne diyebiliriz</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "title": "Interstellar",
    "rating": { "imdb": "8.6" },
    "genre": "Sci-Fi, Drama",
    "plot": "A team of explorers..."
  },
  "ai_answer": "Yüksek puan analizi..."
}`}</code></pre>
              </div>
            </div>

            {/* Currency API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Döviz + AI</h3>
                  <p className="text-slate-600">Kur bilgileri & analiz</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/currency</div>
                  <div className="text-slate-300">
                    ?q=<span className="text-yellow-300">USD</span><br/>
                    &to=<span className="text-yellow-300">TL</span><br/>
                    &ai=<span className="text-yellow-300">Bu kur hakkında analiz yap</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "from": "USD",
    "to": "TL",
    "rate": 33.45,
    "date": "2024-01-15"
  },
  "ai_answer": "Kur trend analizi..."
}`}</code></pre>
              </div>
            </div>

            {/* YouTube Video API */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Youtube className="text-red-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">YouTube + AI</h3>
                  <p className="text-slate-600">Video & kanal bilgileri</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/yt</div>
                  <div className="text-slate-300">
                    ?link=<span className="text-yellow-300">https://youtube.com/watch?v=...</span><br/>
                    &ai=<span className="text-yellow-300">Bu videoyu analiz et</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium mb-2">Örnek Yanıt:</div>
                <pre className="text-sm text-green-700 overflow-x-auto"><code>{`{
  "success": true,
  "data": {
    "title": "Video Title",
    "author": "Channel Name",
    "channel": { "name": "..." }
  },
  "ai_answer": "Video içerik analizi..."
}`}</code></pre>
              </div>
            </div>
          </div>

          {/* Universal AI Feature Section */}
          <div className="mt-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
                <Brain className="text-white w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Evrensel AI Analiz Özelliği</h3>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Tüm veri API'lerine <code className="bg-white px-2 py-1 rounded text-blue-600">&ai=</code> parametresi ekleyerek 
                Gemini AI ile analiz yaptırabilirsiniz. API yanıtına ek olarak <code className="bg-white px-2 py-1 rounded text-purple-600">ai_answer</code> 
                alanında analiz sonucu döner.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Örnek Kullanım</h4>
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <div className="text-green-400 mb-2">{API_BASE_URL}/api/wiki</div>
                  <div className="text-slate-300">
                    ?q=<span className="text-yellow-300">Einstein</span><br/>
                    &ai=<span className="text-yellow-300">Bu bilgileri özetleyip önemli noktaları çıkar</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Ek Parametreler</h4>
                <div className="space-y-2 text-sm">
                  <div><code className="bg-slate-100 px-2 py-1 rounded text-blue-600">model</code> - AI modeli seçimi (varsayılan: gemini-2.5-flash)</div>
                  <div><code className="bg-slate-100 px-2 py-1 rounded text-purple-600">key</code> - Kendi Gemini API anahtarınız (opsiyonel)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
          {/* Ek Notlar Section */}
          <div id="ek-notlar" className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Ek Notlar</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                TTS ve Model seçenekleri hakkında bilgiler
              </p>
            </div>

            {/* TTS Names Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-2 px-4 border-b">TTS İsimleri</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">Zephyr, ... (Daha sonra eklenecek)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Model Options Table */}
            <div className="overflow-x-auto mt-8">
              <table className="min-w-full border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-2 px-4 border-b">Model</th>
                    <th className="py-2 px-4 border-b">Ücretli mi?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">gemini-2.5-flash</td>
                    <td className="py-2 px-4 border-b">Hayır</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">... (Daha sonra eklenecek)</td>
                    <td className="py-2 px-4 border-b">...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </section>
  );
}