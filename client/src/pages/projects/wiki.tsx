
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, Globe, Brain, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function WikiPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("wikipedia");
  const [language, setLanguage] = useState("tr");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const searchWiki = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        q: query,
        type: type,
        lang: language,
        ...(aiPrompt && { ai: aiPrompt })
      });

      const response = await fetch(`/api/wiki?${params}`);
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      setResult({ error: "Network error occurred" });
    } finally {
      setIsSearching(false);
    }
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
                <BookOpen className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">Smart Wiki Explorer</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Wiki Explorer
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore Wikipedia and Wikiquote with AI-powered analysis, summaries, and insights.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="explorer" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="explorer">Explorer</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="api">API Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="explorer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Wikipedia Search
                  </CardTitle>
                  <CardDescription>
                    Search Wikipedia or Wikiquote and get AI-enhanced insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="query">Search Topic</Label>
                    <Input
                      id="query"
                      placeholder="e.g., Einstein, Quantum Physics, Steve Jobs"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Source</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wikipedia">Wikipedia</SelectItem>
                          <SelectItem value="wikiquote">Wikiquote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tr">Turkish</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ai-prompt">AI Analysis (Optional)</Label>
                    <Textarea
                      id="ai-prompt"
                      placeholder="e.g., Summarize the key achievements, Extract the most important quotes, Explain in simple terms"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={searchWiki} 
                    disabled={!query.trim() || isSearching}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search {type === "wikipedia" ? "Wikipedia" : "Wikiquote"}
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
                      {/* Wikipedia/Wikiquote Content */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            {result.title}
                            {result.url && (
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {result.summary && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Summary</h4>
                              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {result.summary}
                              </p>
                            </div>
                          )}

                          {result.images && result.images.length > 0 && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Images</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {result.images.slice(0, 6).map((image: string, index: number) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`${result.title} ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {result.extract && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Content Extract</h4>
                              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {result.extract}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* AI Analysis */}
                      {result.ai_answer && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Brain className="w-5 h-5 text-blue-500" />
                              AI Analysis
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
                  <CardTitle>Search Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">1. Basic Wikipedia Search</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Query: "Einstein" → Biography, achievements, and key information
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">2. Wikiquote Search</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Query: "Steve Jobs", Source: Wikiquote → Famous quotes and sayings
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">3. AI-Enhanced Analysis</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Query: "Quantum Physics"<br/>
                      AI Prompt: "Explain in simple terms" → Simplified explanation of complex topics
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">4. Key Points Extraction</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      AI Prompt: "List the 5 most important achievements" → Structured summary
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
                    <pre>{`// Basic Wikipedia search
const response = await fetch('/api/wiki?q=Einstein&type=wikipedia&lang=tr');

// Wikiquote search
const response = await fetch('/api/wiki?q=Steve Jobs&type=wikiquote&lang=en');

// With AI analysis
const response = await fetch('/api/wiki?q=Quantum Physics&ai=' + 
  encodeURIComponent('Explain in simple terms for beginners'));

const data = await response.json();
console.log('Wiki data:', data.data);
console.log('AI analysis:', data.ai_answer);`}</pre>
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
