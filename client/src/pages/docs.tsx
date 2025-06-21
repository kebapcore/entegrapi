import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Copy, ArrowLeft, ExternalLink, Check, AlertCircle, Info, Code, Brain, Database, Globe, Cloud, Video, Image, Shield, Mic, FileText, Activity, DollarSign, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { API_BASE_URL } from "@/lib/constants";
import Footer from "@/components/footer";

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
  default?: string;
}

interface Endpoint {
  path: string;
  method: string;
  title: string;
  description: string;
  parameters: Parameter[];
  example: string;
  response: string;
  category: string;
}

function AlertBox({ type, children }: { type: 'info' | 'warning' | 'error'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
  };

  const icons = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start space-x-3 ${styles[type]}`}>
      {icons[type]}
      <div className="flex-1">{children}</div>
    </div>
  );
}

function ParameterTable({ parameters }: { parameters: Parameter[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-red-300 dark:border-red-600">
        <thead>
          <tr className="bg-red-50 dark:bg-red-900/30">
            <th className="border border-red-300 dark:border-red-600 px-4 py-2 text-left text-red-900 dark:text-red-100">Parametre</th>
            <th className="border border-red-300 dark:border-red-600 px-4 py-2 text-left text-red-900 dark:text-red-100">Tip</th>
            <th className="border border-red-300 dark:border-red-600 px-4 py-2 text-left text-red-900 dark:text-red-100">Gerekli</th>
            <th className="border border-red-300 dark:border-red-600 px-4 py-2 text-left text-red-900 dark:text-red-100">Açıklama</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, index) => (
            <tr key={index} className="hover:bg-red-50 dark:hover:bg-red-900/20">
              <td className="border border-red-300 dark:border-red-600 px-4 py-2 font-mono text-sm text-red-800 dark:text-red-200">
                {param.name}
                {param.default && <div className="text-xs text-orange-600 dark:text-orange-400">default: {param.default}</div>}
              </td>
              <td className="border border-red-300 dark:border-red-600 px-4 py-2 text-orange-600 dark:text-orange-400">{param.type}</td>
              <td className="border border-red-300 dark:border-red-600 px-4 py-2">
                <Badge variant={param.required ? "destructive" : "outline"} className={param.required ? "bg-red-600" : "border-orange-300 text-orange-700"}>
                  {param.required ? 'Evet' : 'Hayır'}
                </Badge>
              </td>
              <td className="border border-red-300 dark:border-red-600 px-4 py-2 text-red-700 dark:text-red-300">
                {param.description}
                {param.example && <div className="text-xs text-slate-500 mt-1">Örnek: {param.example}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ language, code, id }: { language: string; code: string; id: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="bg-red-900 rounded-t-lg px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium text-red-200">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="text-red-200 hover:bg-red-800"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="bg-red-950 text-red-100 p-4 rounded-b-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-red-200 dark:border-red-800 bg-white/90 dark:bg-red-900/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700">
              {endpoint.method}
            </Badge>
            <code className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded text-sm">
              {endpoint.path}
            </code>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
        <CardTitle className="text-red-900 dark:text-red-100">{endpoint.title}</CardTitle>
        <CardDescription className="text-red-700 dark:text-red-300">{endpoint.description}</CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">Parametreler</h4>
            <ParameterTable parameters={endpoint.parameters} />
          </div>

          <div>
            <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">Örnek İstek</h4>
            <CodeBlock
              language="JavaScript"
              id={`${endpoint.path}-example`}
              code={endpoint.example}
            />
          </div>

          <div>
            <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">Örnek Yanıt</h4>
            <CodeBlock
              language="JSON"
              id={`${endpoint.path}-response`}
              code={endpoint.response}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const endpoints: Endpoint[] = [
    {
      path: "/api/ai",
      method: "GET",
      title: "AI Metin Üretimi",
      description: "Gemini AI ile gelişmiş metin üretimi ve sohbet",
      category: "ai",
      parameters: [
        { name: "query", type: "string", required: true, description: "AI'ya sorulacak soru veya prompt", example: "Türkiye'nin başkenti nedir?" },
        { name: "model", type: "string", required: false, description: "Kullanılacak model", default: "gemini-2.5-flash", example: "gemini-1.5-pro" },
        { name: "system", type: "string", required: false, description: "Sistem mesajı", example: "Sen yararlı bir asistandsın" },
        { name: "image", type: "string", required: false, description: "Görsel URL'si (Gemini Pro için)", example: "https://example.com/image.jpg" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/ai?query=' + encodeURIComponent('Türkiye hakkında bilgi ver') + '&model=gemini-2.5-flash')
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "response": "Türkiye, Avrupa ve Asya kıtalarını birleştiren...",
    "model": "gemini-2.5-flash",
    "usage": {
      "input_tokens": 15,
      "output_tokens": 120
    }
  }
}`
    },
    {
      path: "/api/ai/tts",
      method: "GET",
      title: "Metin-Ses Dönüşümü",
      description: "AI ile metin-ses dönüşümü ve podcast üretimi",
      category: "ai",
      parameters: [
        { name: "query", type: "string", required: false, description: "Doğrudan metin (ai ile birlikte kullanılamaz)" },
        { name: "ai", type: "string", required: false, description: "AI ile içerik üretimi için prompt (query ile birlikte kullanılamaz)" },
        { name: "name", type: "string", required: false, description: "Ses tipi", default: "tr-TR-AhmetNeural", example: "Kore" },
        { name: "model", type: "string", required: false, description: "AI model (sadece ai parametresi ile)", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `// Doğrudan metin
fetch('${API_BASE_URL}/api/ai/tts?query=' + encodeURIComponent('Merhaba dünya') + '&name=Kore')
  .then(response => response.json())
  .then(data => console.log(data.data.audio_url));

// AI ile podcast üretimi
fetch('${API_BASE_URL}/api/ai/tts?ai=' + encodeURIComponent('Teknoloji hakkında podcast') + '&name=Kore')
  .then(response => response.json())
  .then(data => console.log(data.data.audio_url));`,
      response: `{
  "success": true,
  "data": {
    "audio_url": "data:audio/wav;base64,UklGRnoG...",
    "duration": 2.5,
    "voice": "Kore",
    "text": "Merhaba dünya"
  }
}`
    },
    {
      path: "/api/wiki",
      method: "GET",
      title: "Wikipedia API",
      description: "Wikipedia ve Wikiquote verileri ile AI analizi",
      category: "data",
      parameters: [
        { name: "q", type: "string", required: true, description: "Aranacak konu", example: "Einstein" },
        { name: "type", type: "string", required: false, description: "Wikipedia türü", default: "wikipedia", example: "wikiquote" },
        { name: "lang", type: "string", required: false, description: "Dil kodu", default: "tr", example: "en" },
        { name: "ai", type: "string", required: false, description: "AI analiz prompt'u", example: "Bu bilgileri özetle" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/wiki?q=Einstein&type=wikipedia&lang=tr&ai=' + encodeURIComponent('Bu bilgileri 3 maddede özetle'))
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "title": "Albert Einstein",
    "summary": "Albert Einstein, Alman asıllı teorik fizikçi...",
    "url": "https://tr.wikipedia.org/wiki/Albert_Einstein",
    "type": "wikipedia"
  },
  "ai_answer": "Einstein hakkındaki 3 önemli nokta..."
}`
    },
    {
      path: "/api/tdk",
      method: "GET",
      title: "TDK Sözlük",
      description: "Türk Dil Kurumu sözlük verileri",
      category: "data",
      parameters: [
        { name: "query", type: "string", required: true, description: "Aranacak kelime", example: "bilgisayar" },
        { name: "ai", type: "string", required: false, description: "AI analiz prompt'u" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/tdk?query=bilgisayar')
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "word": "bilgisayar",
    "meanings": [
      {
        "definition": "Verileri kabul eden, saklayan ve işleyen elektronik aygıt",
        "example": "Bilgisayar teknolojisi hızla gelişiyor."
      }
    ]
  }
}`
    },
    {
      path: "/api/ai/urlcontext",
      method: "GET",
      title: "URL İçerik Analizi",
      description: "Web sitelerini Gemini AI ile analiz etme",
      category: "ai",
      parameters: [
        { name: "q", type: "string", required: true, description: "AI prompt'u", example: "Bu sitedeki ana konuları özetle: https://example.com" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/ai/urlcontext?q=' + encodeURIComponent('Bu sitedeki ana konuları özetle: https://example.com'))
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "response": "Site ana konuları: teknoloji, yazılım...",
    "model": "gemini-2.5-flash",
    "url_metadata": {
      "title": "Example Site",
      "description": "Site açıklaması"
    }
  }
}`
    },
    {
      path: "/api/translate",
      method: "GET",
      title: "Çeviri",
      description: "Gemini AI ile akıllı çeviri",
      category: "ai",
      parameters: [
        { name: "q", type: "string", required: true, description: "Çevrilecek metin", example: "Merhaba dünya" },
        { name: "to", type: "string", required: true, description: "Hedef dil", example: "english" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/translate?q=' + encodeURIComponent('Merhaba dünya') + '&to=english')
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "original_text": "Merhaba dünya",
    "translated_text": "Hello world",
    "source_language": "auto",
    "target_language": "english"
  }
}`
    },
    {
      path: "/api/movie",
      method: "GET",
      title: "Film Bilgileri",
      description: "Film verileri ve AI analizi",
      category: "data",
      parameters: [
        { name: "q", type: "string", required: true, description: "Film adı", example: "Inception" },
        { name: "ai", type: "string", required: false, description: "AI analiz prompt'u" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/movie?q=Inception&ai=' + encodeURIComponent('Bu filmi analiz et'))
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "title": "Inception",
    "year": "2010",
    "director": "Christopher Nolan",
    "plot": "Film özeti...",
    "rating": "8.8"
  },
  "ai_answer": "Film analizi..."
}`
    },
    {
      path: "/api/earthquake/latest",
      method: "GET",
      title: "Son Deprem",
      description: "En son deprem bilgisi",
      category: "data",
      parameters: [
        { name: "country", type: "string", required: true, description: "Ülke", example: "tr" },
        { name: "ai", type: "string", required: false, description: "AI analiz prompt'u" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/earthquake/latest?country=tr')
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "magnitude": 4.2,
    "location": "Denizli",
    "depth": 7.8,
    "time": "2024-01-15T10:30:00Z",
    "coordinates": {
      "latitude": 37.7749,
      "longitude": 29.0875
    }
  }
}`
    },
    {
      path: "/api/earthquake/last",
      method: "GET",
      title: "Son N Deprem",
      description: "Son N deprem listesi",
      category: "data",
      parameters: [
        { name: "country", type: "string", required: true, description: "Ülke", example: "turkey" },
        { name: "limit", type: "number", required: false, description: "Deprem sayısı (1-50)", default: "10", example: "20" },
        { name: "ai", type: "string", required: false, description: "AI analiz prompt'u" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/earthquake/last?country=turkey&limit=5')
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "earthquakes": [
      {
        "magnitude": 4.2,
        "location": "Denizli",
        "depth": 7.8,
        "time": "2024-01-15T10:30:00Z"
      }
    ],
    "count": 5
  }
}`
    },
    {
      path: "/api/currency",
      method: "GET",
      title: "Döviz Kurları",
      description: "Döviz kurları ve AI analizi",
      category: "data",
      parameters: [
        { name: "q", type: "string", required: true, description: "Kaynak para birimi", example: "USD" },
        { name: "to", type: "string", required: true, description: "Hedef para birimi", example: "TRY" },
        { name: "ai", type: "string", required: false, description: "AI analiz prompt'u" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/currency?q=USD&to=TL&ai=' + encodeURIComponent('Bu kur hakkında analiz yap'))
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "from": "USD",
    "to": "TRY",
    "rate": 33.45,
    "date": "2024-01-15"
  },
  "ai_answer": "Kur trend analizi..."
}`
    },
    {
      path: "/api/yt",
      method: "GET",
      title: "YouTube Video",
      description: "YouTube video bilgileri ve AI analizi",
      category: "data",
      parameters: [
        { name: "link", type: "string", required: true, description: "YouTube video URL'si", example: "https://youtube.com/watch?v=..." },
        { name: "ai", type: "string", required: false, description: "AI analiz prompt'u" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/yt?link=' + encodeURIComponent('https://youtube.com/watch?v=dQw4w9WgXcQ'))
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "title": "Video Başlığı",
    "description": "Video açıklaması",
    "duration": "3:30",
    "views": "1000000",
    "channel": "Kanal Adı"
  }
}`
    },
    {
      path: "/api/ai/video",
      method: "GET",
      title: "Video Analizi",
      description: "Video içeriğini AI ile analiz etme",
      category: "ai",
      parameters: [
        { name: "link", type: "string", required: true, description: "Video URL'si", example: "https://example.com/video.mp4" },
        { name: "prompt", type: "string", required: true, description: "Analiz prompt'u", example: "Bu videodaki ana konuları özetle" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/ai/video?link=' + encodeURIComponent('https://example.com/video.mp4') + '&prompt=' + encodeURIComponent('Bu videodaki ana konuları özetle'))
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "analysis": "Video analizi...",
    "duration": "5:30",
    "model": "gemini-2.5-flash"
  }
}`
    },
    {
      path: "/api/ytch",
      method: "GET",
      title: "YouTube Kanal",
      description: "YouTube kanal bilgileri",
      category: "data",
      parameters: [
        { name: "link", type: "string", required: true, description: "YouTube kanal URL'si", example: "https://youtube.com/@channelname" },
        { name: "ai", type: "string", required: false, description: "AI analiz prompt'u" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/ytch?link=' + encodeURIComponent('https://youtube.com/@channelname'))
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "name": "Kanal Adı",
    "description": "Kanal açıklaması",
    "subscribers": "1M",
    "videos": "150",
    "latest_videos": []
  }
}`
    },
    {
      path: "/api/weather",
      method: "GET",
      title: "Hava Durumu",
      description: "Hava durumu bilgileri ve AI analizi",
      category: "data",
      parameters: [
        { name: "place", type: "string", required: true, description: "Şehir ve ilçe", example: "Istanbul,Kadıköy" },
        { name: "ai", type: "string", required: false, description: "AI analiz prompt'u" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/weather?place=Istanbul,Kadıköy&ai=' + encodeURIComponent('Hava durumu önerisi ver'))
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "location": "Istanbul, Kadıköy",
    "temperature": 22,
    "description": "Parçalı bulutlu",
    "humidity": 65,
    "wind_speed": 15,
    "forecast": []
  },
  "ai_answer": "Hava durumu önerisi..."
}`
    },
    {
      path: "/api/i/:prompt",
      method: "GET",
      title: "Görsel Üretimi (URL)",
      description: "AI ile görsel oluşturma (URL formatında)",
      category: "ai",
      parameters: [
        { name: "prompt", type: "string", required: true, description: "Görsel prompt'u (URL'de)", example: "bir kedi" },
        { name: "type", type: "string", required: false, description: "Görsel türü", default: "gemini", example: "imagen" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.0-flash-preview-image-generation" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/i/' + encodeURIComponent('bir kedi') + '?type=gemini')
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "image_url": "data:image/jpeg;base64,/9j/4AAQ...",
    "prompt": "bir kedi",
    "model": "gemini-2.0-flash-preview-image-generation"
  }
}`
    },
    {
      path: "/api/i",
      method: "GET",
      title: "Görsel Üretimi (Query)",
      description: "AI ile görsel oluşturma (query parametresi ile)",
      category: "ai",
      parameters: [
        { name: "prompt", type: "string", required: true, description: "Görsel prompt'u", example: "bir kedi" },
        { name: "type", type: "string", required: false, description: "Görsel türü", default: "gemini", example: "imagen" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.0-flash-preview-image-generation" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/i?prompt=' + encodeURIComponent('bir kedi') + '&type=gemini')
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "image_url": "data:image/jpeg;base64,/9j/4AAQ...",
    "prompt": "bir kedi",
    "model": "gemini-2.0-flash-preview-image-generation"
  }
}`
    },
    {
      path: "/api/ipcheck",
      method: "GET",
      title: "IP Kontrolü",
      description: "IP adresi bilgileri",
      category: "utility",
      parameters: [
        { name: "ip", type: "string", required: false, description: "IP adresi (boş bırakılırsa otomatik)", example: "8.8.8.8" }
      ],
      example: `fetch('${API_BASE_URL}/api/ipcheck?ip=8.8.8.8')
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "ip": "8.8.8.8",
    "country": "United States",
    "city": "Mountain View",
    "isp": "Google LLC",
    "timezone": "America/Los_Angeles"
  }
}`
    },
    {
      path: "/api/check",
      method: "GET",
      title: "İçerik Moderasyonu",
      description: "Metin, video ve görsel içerik moderasyonu",
      category: "ai",
      parameters: [
        { name: "q", type: "string", required: false, description: "Metin içeriği (i veya v ile birlikte kullanılamaz)" },
        { name: "i", type: "string", required: false, description: "Görsel URL'si (q veya v ile birlikte kullanılamaz)" },
        { name: "v", type: "string", required: false, description: "Video URL'si (q veya i ile birlikte kullanılamaz)" },
        { name: "type", type: "string", required: false, description: "Sonuç türü", default: "boolean", example: "yuzdeli" },
        { name: "prompt", type: "string", required: false, description: "Özel moderasyon prompt'u" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `// Metin kontrolü
fetch('${API_BASE_URL}/api/check?q=' + encodeURIComponent('Test metni') + '&type=yuzdeli')
  .then(response => response.json())
  .then(data => console.log(data));

// Görsel kontrolü
fetch('${API_BASE_URL}/api/check?i=' + encodeURIComponent('https://example.com/image.jpg'))
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "appropriate": true,
    "confidence": 95,
    "analysis": "İçerik analizi...",
    "type": "text"
  }
}`
    },
    {
      path: "/api/ai/autosub",
      method: "GET",
      title: "Otomatik Altyazı",
      description: "Ses dosyalarından otomatik altyazı üretimi",
      category: "ai",
      parameters: [
        { name: "myaudiolink", type: "string", required: true, description: "Ses dosyası URL'si", example: "https://example.com/audio.mp3" },
        { name: "prompt", type: "string", required: false, description: "Özel prompt" },
        { name: "lang", type: "string", required: false, description: "Dil", example: "tr" },
        { name: "model", type: "string", required: false, description: "AI model", default: "gemini-2.5-flash" },
        { name: "key", type: "string", required: false, description: "API anahtarı (opsiyonel)" }
      ],
      example: `fetch('${API_BASE_URL}/api/ai/autosub?myaudiolink=' + encodeURIComponent('https://example.com/audio.mp3') + '&lang=tr')
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "transcript": "Transkript metni...",
    "timestamps": [
      {
        "start": 0,
        "end": 5.2,
        "text": "Merhaba"
      }
    ],
    "duration": 120
  }
}`
    },
    {
      path: "/api/stats",
      method: "GET",
      title: "İstatistikler",
      description: "API kullanım istatistikleri",
      category: "utility",
      parameters: [],
      example: `fetch('${API_BASE_URL}/api/stats')
  .then(response => response.json())
  .then(data => console.log(data));`,
      response: `{
  "success": true,
  "data": {
    "requestsPerSecond": 0,
    "totalRequests": 1542,
    "endpointCount": 22,
    "dailyRequests": 89
  }
}`
    }
  ];

  const categories = [
    { id: "all", label: "Tümü", icon: <Globe className="w-4 h-4" />, count: endpoints.length },
    { id: "ai", label: "AI APIs", icon: <Brain className="w-4 h-4" />, count: endpoints.filter(e => e.category === "ai").length },
    { id: "data", label: "Veri APIs", icon: <Database className="w-4 h-4" />, count: endpoints.filter(e => e.category === "data").length },
    { id: "utility", label: "Yardımcı", icon: <Activity className="w-4 h-4" />, count: endpoints.filter(e => e.category === "utility").length }
  ];

  const filteredEndpoints = selectedCategory === "all" 
    ? endpoints 
    : endpoints.filter(endpoint => endpoint.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
      {/* Header */}
      <header className="bg-white dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mr-4 text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Ana Sayfa
                </Button>
              </Link>
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <Code className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-red-900 dark:text-red-100">API Dokümantasyonu</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 dark:text-red-300 dark:border-red-700 dark:bg-red-900/30">
                v1.0 - {endpoints.length} Endpoint
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24 border-red-200 dark:border-red-800 bg-white/90 dark:bg-red-900/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-red-900 dark:text-red-100">Kategoriler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {category.icon}
                      {category.label}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="mt-6 border-red-200 dark:border-red-800 bg-white/90 dark:bg-red-900/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-red-900 dark:text-red-100">Hızlı Bilgi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">Base URL</h4>
                  <code className="bg-red-900 text-green-400 px-2 py-1 rounded text-xs block">
                    {API_BASE_URL}
                  </code>
                </div>
                
                <AlertBox type="info">
                  <div className="text-sm">
                    <strong>Kayıt Gerekmez:</strong> Tüm API'ler herkese açıktır.
                  </div>
                </AlertBox>

                <AlertBox type="warning">
                  <div className="text-sm">
                    <strong>AI Özellikleri:</strong> Bazı AI özellikleri için API anahtarı gerekebilir.
                  </div>
                </AlertBox>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:w-3/4 space-y-6">
            {filteredEndpoints.map((endpoint) => (
              <EndpointCard key={endpoint.path} endpoint={endpoint} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}