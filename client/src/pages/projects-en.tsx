import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Play, ExternalLink, Mic, Video, MessageSquare, Image, Music, Globe, Zap, Bot, FileText, ArrowRight } from "lucide-react";

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

export default function ProjectsEnPage() {
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
      codeExample: `// AI podcast generation
const response = await fetch('/api/ai/tts?ai=' + 
  encodeURIComponent('Create a podcast about technology') + 
  '&name=Kore&model=gemini-2.5-flash');

const data = await response.json();
console.log('Audio URL:', data.data.audio_url);
console.log('Generated text:', data.data.text);`,
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
      codeExample: `// Auto subtitle generation
const response = await fetch('/api/ai/autosub?myaudiolink=' + 
  encodeURIComponent('https://example.com/audio.mp3') + 
  '&lang=english');

const data = await response.json();
console.log('Subtitles:', data.data.transcript);

// Translation
const translation = await fetch('/api/translate?q=' + 
  encodeURIComponent(data.data.transcript) + '&to=spanish');`,
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
      codeExample: `// Image moderation
const imageCheck = await fetch('/api/check?i=' + 
  encodeURIComponent('https://example.com/image.jpg') + 
  '&type=percentage');

// Text moderation
const textCheck = await fetch('/api/check?q=' + 
  encodeURIComponent('Sample text to moderate') + 
  '&type=percentage');

console.log('Moderation results:', imageCheck, textCheck);`,
      features: ["Image content analysis", "Text sentiment analysis", "Video moderation", "Real-time processing"]
    },
    {
      id: "weather-ai",
      title: "Smart Weather Assistant",
      description: "Intelligent weather forecasting with AI-powered insights and recommendations",
      category: "data-ai",
      apis: ["/api/weather", "/api/ai"],
      icon: <Globe className="w-6 h-6" />,
      demoRoute: "/projects/weather",
      codeExample: `// Weather data with AI analysis
const weather = await fetch('/api/weather?place=New York,Manhattan');
const weatherData = await weather.json();

// AI analysis
const analysis = await fetch('/api/ai?query=' + 
  encodeURIComponent('Analyze this weather data and give recommendations: ' + 
  JSON.stringify(weatherData)));

console.log('Weather insights:', analysis);`,
      features: ["Real-time weather data", "AI-powered analysis", "Location-based forecasts", "Smart recommendations"]
    },
    {
      id: "wiki-explorer",
      title: "AI Wiki Explorer",
      description: "Enhanced Wikipedia exploration with AI-powered summaries and intelligent content discovery",
      category: "data-ai",
      apis: ["/api/wiki", "/api/ai"],
      icon: <FileText className="w-6 h-6" />,
      demoRoute: "/projects/wiki",
      codeExample: `// Wikipedia search with AI enhancement
const wikiData = await fetch('/api/wiki?q=Einstein&type=wikipedia&lang=en');
const data = await wikiData.json();

// AI summary
const summary = await fetch('/api/ai?query=' + 
  encodeURIComponent('Summarize this in 3 key points: ' + data.data.summary));

console.log('AI-enhanced wiki summary:', summary);`,
      features: ["Wikipedia integration", "AI-powered summaries", "Multi-language support", "Smart content discovery"]
    },
    {
      id: "image-gen",
      title: "AI Image Generator",
      description: "Create stunning images from text descriptions using advanced AI models",
      category: "ai-creative",
      apis: ["/api/i"],
      icon: <Zap className="w-6 h-6" />,
      demoRoute: "/projects/image-gen",
      codeExample: `// AI image generation
const response = await fetch('/api/i/prompt=' + 
  encodeURIComponent('A beautiful sunset over mountains') + 
  '&type=gemini&key=your_api_key');

const data = await response.json();
console.log('Generated image:', data.data.image_url);`,
      features: ["Text-to-image generation", "Multiple AI models", "High-quality output", "Custom prompts"]
    }
  ];

  const categories = [
    { id: "all", label: "All Projects", count: projects.length },
    { id: "ai-audio", label: "AI & Audio", count: projects.filter(p => p.category === "ai-audio").length },
    { id: "video-ai", label: "Video & AI", count: projects.filter(p => p.category === "video-ai").length },
    { id: "ai-moderation", label: "AI Moderation", count: projects.filter(p => p.category === "ai-moderation").length },
    { id: "data-ai", label: "Data & AI", count: projects.filter(p => p.category === "data-ai").length },
    { id: "ai-creative", label: "AI Creative", count: projects.filter(p => p.category === "ai-creative").length }
  ];

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Project Examples
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Discover what you can build with Entegar API through these practical examples and demonstrations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  {category.label}
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      {project.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* APIs Used */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">APIs Used:</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.apis.map((api) => (
                      <Badge key={api} variant="secondary" className="text-xs font-mono">
                        {api}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Features:</h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {project.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Code Example */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Code Example:</h4>
                  <div className="bg-slate-900 rounded-lg p-3 text-xs overflow-x-auto">
                    <pre className="text-slate-300">
                      <code>{project.codeExample.split('\n').slice(0, 4).join('\n')}...</code>
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  {project.demoRoute && (
                    <Link to={project.demoRoute}>
                      <Button className="flex-1" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Try Demo
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" size="sm" className="flex-1">
                    <Code className="w-4 h-4 mr-2" />
                    View Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Ready to Build Your Own?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Get started with our comprehensive API documentation and bring your ideas to life.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/docs-en">
                  <Button size="lg">
                    <FileText className="w-5 h-5 mr-2" />
                    View Documentation
                  </Button>
                </Link>
                <Link to="/home-en">
                  <Button variant="outline" size="lg">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Explore APIs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}