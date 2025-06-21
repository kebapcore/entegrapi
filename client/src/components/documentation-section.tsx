import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Key, Gauge } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

export default function DocumentationSection() {
  const [activeTab, setActiveTab] = useState('javascript');

  const codeExamples = {
    javascript: `// JavaScript örneği
const response = await fetch('${API_BASE_URL}/api/ai?query=Merhaba&model=gemini-2.5-flash');
const data = await response.json();
console.log(data.data.response);

// TTS örneği
const ttsResponse = await fetch('${API_BASE_URL}/api/ai/tts?query=Merhaba%20dünya&name=Kore');
const audioData = await ttsResponse.json();
console.log(audioData.data.audio_url);`,

    python: `# Python örneği
import requests

response = requests.get('/api/ai', params={
    'query': 'Merhaba',
    'model': 'gemini-2.5-flash'
})
data = response.json()
print(data['data']['response'])

# TTS örneği
tts_response = requests.get('/api/ai/tts', params={
    'query': 'Merhaba dünya',
    'name': 'Kore'
})
audio_data = tts_response.json()
print(audio_data['data']['audio_url'])`,

    curl: `# cURL örneği
curl "https://api.entegar.com/api/ai?query=Merhaba&model=gemini-2.5-flash"

# TTS örneği
curl "https://api.entegar.com/api/ai/tts?query=Merhaba%20dünya&name=Kore"

# Wikipedia örneği
curl "https://api.entegar.com/api/wiki?query=Istanbul"`
  };

  return (
    <section id="docs" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
            <Code className="text-purple-600 w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Hızlı Başlangıç</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            API'lerimizi kullanmaya başlamak için aşağıdaki adımları takip edin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Authentication */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <h3 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
              <Key className="text-blue-600 mr-3 w-6 h-6" />
              Kimlik Doğrulama
            </h3>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-medium text-blue-800 mb-2">1. API Key Alın</div>
                <p className="text-blue-700 text-sm">Entegar hesabınızdan ücretsiz API anahtarınızı alın.</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-medium text-blue-800 mb-2">2. İsteğe Ekleyin</div>
                <p className="text-blue-700 text-sm">API anahtarınızı <code className="bg-blue-100 px-1 rounded">key</code> parametresi olarak ekleyin.</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="font-medium text-amber-800 mb-2">💡 İpucu</div>
                <p className="text-amber-700 text-sm">API anahtarı belirtmezseniz, sistem otomatik olarak demo anahtarını kullanır (sınırlı).</p>
              </div>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <h3 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
              <Gauge className="text-emerald-600 mr-3 w-6 h-6" />
              Limitler
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600">Ücretsiz Plan</span>
                <span className="font-medium text-slate-800">1000 istek/gün</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600">Demo Anahtar</span>
                <span className="font-medium text-slate-800">100 istek/gün</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600">Yanıt Süresi</span>
                <span className="font-medium text-slate-800">~2-5 saniye</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-600">Format</span>
                <span className="font-medium text-slate-800">JSON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-slate-800 mb-8 text-center">Kod Örnekleri</h3>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200">
              <Button
                variant={activeTab === 'javascript' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('javascript')}
                className={`rounded-none px-6 py-4 text-sm font-medium ${
                  activeTab === 'javascript' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                JavaScript
              </Button>
              <Button
                variant={activeTab === 'python' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('python')}
                className={`rounded-none px-6 py-4 text-sm font-medium ${
                  activeTab === 'python' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Python
              </Button>
              <Button
                variant={activeTab === 'curl' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('curl')}
                className={`rounded-none px-6 py-4 text-sm font-medium ${
                  activeTab === 'curl' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                cURL
              </Button>
            </div>

            <div className="p-6">
              <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}