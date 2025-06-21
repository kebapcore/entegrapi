
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Cloud, Thermometer, Droplets, Wind, Eye, ArrowLeft, MapPin, Brain } from "lucide-react";
import { Link } from "wouter";

export default function WeatherPage() {
  const [location, setLocation] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const getWeather = async () => {
    if (!location.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        place: location,
        ...(aiPrompt && { ai: aiPrompt })
      });

      const response = await fetch(`/api/weather?${params}`);
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      setResult({ error: "Network error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (description: string) => {
    const lower = description.toLowerCase();
    if (lower.includes("rain") || lower.includes("yağmur")) return "🌧️";
    if (lower.includes("cloud") || lower.includes("bulut")) return "☁️";
    if (lower.includes("sun") || lower.includes("güneş")) return "☀️";
    if (lower.includes("snow") || lower.includes("kar")) return "❄️";
    return "🌤️";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Cloud className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">Smart Weather Assistant</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Weather Assistant
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Get detailed weather information with AI-powered insights and personalized recommendations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="weather" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="api">API Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="weather" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Weather Lookup
                  </CardTitle>
                  <CardDescription>
                    Enter a city name to get current weather conditions and AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Istanbul, Ankara, Istanbul,Kadıköy"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ai-prompt">AI Analysis (Optional)</Label>
                    <Textarea
                      id="ai-prompt"
                      placeholder="e.g., Should I wear a jacket today? What activities do you recommend?"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={getWeather} 
                    disabled={!location.trim() || isLoading}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Getting Weather...
                      </>
                    ) : (
                      <>
                        <Cloud className="w-4 h-4 mr-2" />
                        Get Weather
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {result && (
                <div className="space-y-6">
                  {result.error ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          {result.error}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {/* Weather Data */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">{getWeatherIcon(result.weather?.description || "")}</span>
                            Current Weather - {result.weather?.location || location}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                              <Thermometer className="w-6 h-6 mx-auto mb-2 text-red-500" />
                              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {result.weather?.temperature}°C
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">Temperature</div>
                              <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                Feels like {result.weather?.feels_like}°C
                              </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                              <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {result.weather?.humidity}%
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">Humidity</div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                              <Wind className="w-6 h-6 mx-auto mb-2 text-green-500" />
                              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {result.weather?.wind_speed}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">Wind Speed</div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                              <Eye className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {result.weather?.visibility || "N/A"}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">Visibility</div>
                            </div>
                          </div>

                          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Conditions</h4>
                            <p className="text-slate-700 dark:text-slate-300">
                              {result.weather?.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* AI Analysis */}
                      {result.ai_answer && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Brain className="w-5 h-5 text-blue-500" />
                              AI Weather Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {result.ai_answer}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">1. Basic Weather Query</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Location: "Istanbul" → Current weather conditions for Istanbul
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">2. Specific District</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Location: "Istanbul,Kadıköy" → Weather for Kadıköy district in Istanbul
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">3. With AI Analysis</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Location: "Ankara"<br/>
                      AI Prompt: "Should I wear a jacket today?" → Weather + clothing recommendations
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">4. Activity Recommendations</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      AI Prompt: "What outdoor activities do you recommend?" → Weather-based activity suggestions
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
                    <pre>{`// Basic weather query
const response = await fetch('/api/weather?place=Istanbul');

// Weather with AI analysis
const response = await fetch('/api/weather?place=Istanbul&ai=' + 
  encodeURIComponent('Should I wear a jacket today?'));

// Specific district
const response = await fetch('/api/weather?place=Istanbul,Kadıköy');

const data = await response.json();
console.log('Weather:', data.data.weather);
console.log('AI Analysis:', data.ai_answer);`}</pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
