
import { Code, ArrowRight, Cloud, Image, Zap, Globe, Database, Bot, Shield, MapPin, AudioLines, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Footer from "@/components/footer";

interface Statistics {
  requestsPerSecond: number;
  totalRequests: number;
  endpointCount: number;
  dailyRequests: number;
}

export default function HomeEnPage() {
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Entegar</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-md">
              Easily integrate your project with other services.
            </p>
            
            {/* Real-time Statistics */}
            {stats?.success && (
              <div className="bg-gray-900/50 rounded-lg p-6 mb-8 border border-gray-700">
                <div className="flex items-center justify-center mb-4">
                  <Activity className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold">Live Statistics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-red-500 font-bold text-lg">{stats.data.requestsPerSecond}</div>
                    <div className="text-gray-400 text-xs">Requests/sec</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-500 font-bold text-lg">{stats.data.totalRequests}</div>
                    <div className="text-gray-400 text-xs">Total Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-500 font-bold text-lg">{stats.data.endpointCount}</div>
                    <div className="text-gray-400 text-xs">Endpoints</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-500 font-bold text-lg">{stats.data.dailyRequests}</div>
                    <div className="text-gray-400 text-xs">Daily Requests</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <a 
                href="/docs-en" 
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Get Started
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
                  <h3 className="text-lg font-semibold">Artificial Intelligence</h3>
                </div>
                <p className="text-gray-600 text-sm text-center md:text-left">
                  Text analysis with GPT and Gemini models
                </p>
              </div>
              
              <div className="text-left">
                <div className="flex items-center mb-3 justify-center md:justify-start">
                  <Database className="w-6 h-6 mr-3 text-red-600" />
                  <h3 className="text-lg font-semibold">Data Processing</h3>
                </div>
                <p className="text-gray-600 text-sm text-center md:text-left">
                  Wiki, YouTube and web data analysis
                </p>
              </div>
              
              <div className="text-left">
                <div className="flex items-center mb-3 justify-center md:justify-start">
                  <Zap className="w-6 h-6 mr-3 text-red-600" />
                  <h3 className="text-lg font-semibold">Real-time</h3>
                </div>
                <p className="text-gray-600 text-sm text-center md:text-left">
                  Fast and reliable API responses
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
              Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empower your projects with Entegar API
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Cloud className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Weather</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Detailed weather information. Real-time data by city and district.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/weather?place=Istanbul,Kadıköy
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Image className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Image Generation</h3>
              </div>
              <p className="text-gray-600 mb-4">
                AI image creation with Imagen and Gemini models.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/i/prompt=a cat?type=gemini
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Bot className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">AI Chat</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Text analysis and chat features with artificial intelligence.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/ai?prompt=Hello
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Web Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Extract and analyze data from web pages.
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
                Process and summarize Wikipedia data with AI.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/wiki?q=Einstein
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <MapPin className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">IP Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Location, ISP and detailed information analysis from IP addresses.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/ipcheck?ip=8.8.8.8
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Content Moderation</h3>
              </div>
              <p className="text-gray-600 mb-4">
                AI-powered text and video content appropriateness control.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/check?q=test&type=yuzdeli
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <AudioLines className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">Automatic Subtitles</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Timestamped subtitle generation from audio files.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /api/ai/autosub?myaudiolink=audio.mp3
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">More</h3>
              </div>
              <p className="text-gray-600 mb-4">
                YouTube, translation, earthquake data and more.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800">
                /docs-en
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
