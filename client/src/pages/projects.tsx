import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Play, ExternalLink, Mic, Video, MessageSquare, Image, Music, Globe, Zap, Bot, FileText, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectExample {
  id: string;
  title: string;
  description: string;
  category: string;
  apis: string[];
  icon: React.ReactNode;
  demoRoute?: string;
  codeExample: string;
  features: string[];
}

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const projects: ProjectExample[] = [
    {
      id: "ptp",
      title: "AI Podcast Generator",
      description: "Transform any idea into a professional podcast using AI with natural voice narration",
      category: "ai-audio",
      apis: ["/api/ai/tts"],
      icon: <Mic className="w-6 h-6" />,
      demoRoute: "/projects/ptp",
      codeExample: `// AI ile podcast üretimi
const response = await fetch('/api/ai/tts?ai=' + 
  encodeURIComponent('Teknoloji hakkında podcast') + 
  '&name=Kore&model=gemini-2.5-flash');

const data = await response.json();
console.log('Ses URL:', data.data.audio_url);
console.log('Üretilen metin:', data.data.text);`,
      features: ["AI content generation", "Natural voice synthesis", "Multiple voice options", "Direct audio download"]
    },
    {
      id: "smart-subtitles",
      title: "Smart Subtitle Generator",
      description: "Automatically generate and translate subtitles for audio files with AI enhancement",
      category: "video-ai",
      apis: ["/api/ai/autosub", "/api/translate"],
      icon: <Video className="w-6 h-6" />,
      demoRoute: "/projects/subtitles",
      codeExample: `// Otomatik altyazı üretimi
const response = await fetch('/api/ai/autosub?myaudiolink=' + 
  encodeURIComponent('https://example.com/audio.mp3') + 
  '&lang=turkish');

const data = await response.json();
console.log('Altyazı:', data.data.transcript);

// Çeviri
const translation = await fetch('/api/translate?q=' + 
  encodeURIComponent(data.data.transcript) + '&to=en');`,
      features: ["Auto subtitle generation", "Multi-language translation", "Timestamped output", "Audio file support"]
    },
    {
      id: "content-moderator",
      title: "AI Content Moderator",
      description: "Advanced content moderation system using AI for images, text and video analysis",
      category: "ai-moderation",
      apis: ["/api/check"],
      icon: <Image className="w-6 h-6" />,
      demoRoute: "/projects/moderator",
      codeExample: `// Görsel kontrolü
const imageCheck = await fetch('/api/check?i=' + 
  encodeURIComponent('https://example.com/image.jpg') + 
  '&type=yuzdeli');

// Metin kontrolü
const textCheck = await fetch('/api/check?q=' + 
  encodeURIComponent('Kontrol edilecek metin') + 
  '&type=boolean');

console.log('Sonuçlar:', await Promise.all([
  imageCheck.json(), textCheck.json()
]));`,
      features: ["Image safety analysis", "Text content moderation", "Percentage scoring", "Custom moderation rules"]
    },
    {
      id: "weather-assistant",
      title: "Smart Weather Assistant",
      description: "AI-powered weather analysis with personalized recommendations and insights",
      category: "utility-ai",
      apis: ["/api/weather", "/api/ai"],
      icon: <Zap className="w-6 h-6" />,
      demoRoute: "/projects/weather",
      codeExample: `// Hava durumu + AI analizi
const weather = await fetch('/api/weather?place=Istanbul&ai=' + 
  encodeURIComponent('Bu hava durumu için öneri ver'));

const data = await weather.json();
console.log('Hava durumu:', data.data.weather);
console.log('AI önerisi:', data.ai_answer);`,
      features: ["Real-time weather data", "AI recommendations", "City-based forecasts", "Intelligent insights"]
    },
    {
      id: "wiki-explorer",
      title: "Smart Wiki Explorer",
      description: "Intelligent Wikipedia exploration with AI-enhanced summaries and insights",
      category: "knowledge-ai",
      apis: ["/api/wiki", "/api/ai"],
      icon: <MessageSquare className="w-6 h-6" />,
      demoRoute: "/projects/wiki",
      codeExample: `// Wikipedia + AI analizi
const wiki = await fetch('/api/wiki?q=Einstein&ai=' + 
  encodeURIComponent('Bu bilgileri özetleyip önemli noktaları çıkar'));

const data = await wiki.json();
console.log('Wikipedia:', data.data);
console.log('AI analizi:', data.ai_answer);`,
      features: ["Wikipedia integration", "AI-enhanced explanations", "Smart summaries", "Related topics"]
    },
    {
      id: "image-generator",
      title: "AI Image Generator",
      description: "Create stunning images from text descriptions using advanced AI models",
      category: "ai-creative",
      apis: ["/api/i"],
      icon: <Image className="w-6 h-6" />,
      demoRoute: "/projects/image-gen",
      codeExample: `// AI görsel üretimi
const response = await fetch('/api/i?prompt=' + 
  encodeURIComponent('Deniz kenarında gün batımı') + 
  '&type=gemini');

const data = await response.json();
console.log('Base64 görsel:', data.data.image_data);
console.log('AI açıklaması:', data.data.text_response);`,
      features: ["Text-to-image generation", "Multiple AI models", "High-quality output", "Turkish prompt support"]
    }
  ];

  const categories = [
    { id: "all", name: "All Projects", icon: <Bot className="w-4 h-4" /> },
    { id: "ai-audio", name: "AI & Audio", icon: <Mic className="w-4 h-4" /> },
    { id: "video-ai", name: "Video & AI", icon: <Video className="w-4 h-4" /> },
    { id: "ai-moderation", name: "AI Moderation", icon: <Image className="w-4 h-4" /> },
    { id: "utility-ai", name: "Utility AI", icon: <Zap className="w-4 h-4" /> },
    { id: "knowledge-ai", name: "Knowledge AI", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "ai-creative", name: "Creative AI", icon: <Image className="w-4 h-4" /> }
  ];

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white w-4 h-4" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">Entegar API</span>
              </a>
            </div>
            <nav className="flex space-x-8">
              <Link href="/">
                <span className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer">Ana Sayfa</span>
              </Link>
              <Link href="/docs">
                <span className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer">Dokümantasyon</span>
              </Link>
              <Link href="/projects">
                <span className="text-red-600 dark:text-red-400 font-medium cursor-pointer">Projeler</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm">
            <span className="text-slate-500 dark:text-slate-400">Ana Sayfa</span>
            <span className="mx-2 text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-slate-100">Interactive Projects</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 bg-gradient-to-r from-red-50 to-slate-50 dark:from-red-900/20 dark:to-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Interactive API Projects
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Explore real-world applications built with our API ecosystem. Each project demonstrates 
              practical implementations with working code examples and interactive demos.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    {project.icon}
                  </div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">{project.title}</CardTitle>
                </div>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="demo">Demo</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">APIs Used:</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.apis.map((api) => (
                          <Badge key={api} variant="secondary" className="text-xs">
                            {api}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Features:</h4>
                      <ul className="text-sm space-y-1">
                        {project.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Example Implementation</span>
                      </div>
                      <pre className="text-xs overflow-x-auto text-slate-800 dark:text-slate-200">
                        <code>{project.codeExample}</code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="demo" className="space-y-4">
                    <div className="text-center">
                      {project.demoRoute ? (
                        <Link href={project.demoRoute}>
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            <Play className="w-4 h-4 mr-2" />
                            Try Interactive Demo
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" disabled className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo Coming Soon
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      Interactive demo with real API integration
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Build Your Own Project</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Ready to create something amazing? Check out our comprehensive API documentation 
            and start building with our powerful endpoints.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/docs">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <FileText className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowRight className="w-4 h-4 mr-2" />
                API Playground
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Entegar API</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Güçlü AI ve veri API'leri ile projelerinizi geliştirin
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              Entegar <span className="text-red-500">MŞN Development Inc</span> alt markasıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}