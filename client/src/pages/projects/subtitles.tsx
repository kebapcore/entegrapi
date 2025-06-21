import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Upload, Play, Download, Languages, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function SubtitlesPage() {
  const [audioUrl, setAudioUrl] = useState("");
  const [language, setLanguage] = useState("auto");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateSubtitles = async () => {
    if (!audioUrl.trim()) return;

    setIsGenerating(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        myaudiolink: audioUrl,
        ...(language !== "auto" && { lang: language })
      });

      const response = await fetch(`/api/ai/autosub?${params}`);
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      setResult({ error: "Network error occurred" });
    } finally {
      setIsGenerating(false);
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
                <Video className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">Smart Subtitle Generator</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Subtitle Generator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Generate timestamped subtitles from audio files with AI. Supports multiple languages 
            and automatic translation capabilities.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generator">Generator</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="api">API Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Audio Input
                  </CardTitle>
                  <CardDescription>
                    Enter the URL of your audio file (MP3, WAV, M4A supported)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="audio-url">Audio File URL</Label>
                    <Input
                      id="audio-url"
                      type="url"
                      placeholder="https://example.com/audio.mp3"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="language">Target Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto Detect</SelectItem>
                        <SelectItem value="turkish">Turkish (Translate to Turkish)</SelectItem>
                        <SelectItem value="en">English (Translate to English)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generateSubtitles} 
                    disabled={!audioUrl.trim() || isGenerating}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Generating Subtitles...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Subtitles
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {result.error ? (
                        <div className="text-red-600">Error</div>
                      ) : (
                        <>
                          <Languages className="w-5 h-5" />
                          Generated Subtitles
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.error ? (
                      <div className="text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        {result.error}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Language: {result.language || "Auto-detected"}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(result.transcript)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                            {result.transcript}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">1. Auto-detect Language</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Audio: English podcast → Output: "00:01 ; Hello, welcome to our show..."
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">2. Translate to Turkish</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Audio: English speech → Output: "00:01 ; Merhaba, programımıza hoş geldiniz..."
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">3. Translate to English</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Audio: Turkish speech → Output: "00:01 ; Hello, welcome to our program..."
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
                    <pre>{`// Basic subtitle generation
const response = await fetch('/api/ai/autosub?myaudiolink=' + 
  encodeURIComponent('https://example.com/audio.mp3'));

// With language translation
const response = await fetch('/api/ai/autosub?myaudiolink=' + 
  encodeURIComponent('https://example.com/audio.mp3') + 
  '&lang=turkish');

const data = await response.json();
console.log('Subtitles:', data.data.transcript);`}</pre>
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