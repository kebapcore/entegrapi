
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Palette, Download, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("gemini");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        prompt: prompt,
        type: type
      });

      const response = await fetch(`/api/i?${params}`);
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

  const downloadImage = () => {
    if (!result?.image_data) return;
    
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${result.image_data}`;
    link.download = `generated-image-${Date.now()}.png`;
    link.click();
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
                <Image className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">AI Image Generator</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Image Generator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Create stunning images from text descriptions using advanced AI models. 
            Supports Turkish prompts and multiple generation models.
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
                    <Palette className="w-5 h-5" />
                    Image Generation
                  </CardTitle>
                  <CardDescription>
                    Describe what you want to see and AI will create it for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Image Description</Label>
                    <Input
                      id="prompt"
                      placeholder="e.g., Deniz kenarında gün batımı, A cat playing in a garden, Futuristic city skyline"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">AI Model</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Gemini (Fast + Text Response)
                          </div>
                        </SelectItem>
                        <SelectItem value="imagen">
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            Imagen (High Quality)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generateImage} 
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Image
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
                        <span className="text-red-600">Generation Failed</span>
                      ) : (
                        <>
                          <Image className="w-5 h-5" />
                          Generated Image
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
                        {/* Generated Image */}
                        <div className="flex justify-center">
                          <div className="relative">
                            <img
                              src={`data:image/png;base64,${result.image_data}`}
                              alt="Generated image"
                              className="max-w-full h-auto rounded-lg shadow-lg"
                              style={{ maxHeight: "512px" }}
                            />
                            <Button
                              onClick={downloadImage}
                              size="sm"
                              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Image Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Model Used</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {result.model || type}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">Format</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              PNG (Base64 encoded)
                            </p>
                          </div>
                        </div>

                        {/* AI Text Response (Gemini only) */}
                        {result.text_response && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">AI Description</h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {result.text_response}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prompt Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">🌅 Nature & Landscapes</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      "Deniz kenarında gün batımı" • "Snow-covered mountain peak" • "Tropical rainforest waterfall"
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">🎨 Art & Style</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      "Van Gogh tarzında gece manzarası" • "Minimalist geometric abstract art" • "Watercolor painting of flowers"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">🏙️ Architecture & Cities</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      "Futuristik şehir manzarası" • "Medieval castle on a hill" • "Modern glass skyscraper at night"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">🐱 Animals & Characters</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      "Bahçede oynayan sevimli kedi" • "Majestic eagle flying over mountains" • "Cartoon robot character"
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
                    <pre>{`// Gemini image generation (with text response)
const response = await fetch('/api/i?prompt=' + 
  encodeURIComponent('Deniz kenarında gün batımı') + 
  '&type=gemini');

// Imagen high-quality generation
const response = await fetch('/api/i?prompt=' + 
  encodeURIComponent('A cat playing in a garden') + 
  '&type=imagen');

const data = await response.json();
if (data.success) {
  // Base64 image data
  const imageData = data.data.image_data;
  
  // Display in HTML
  const img = document.createElement('img');
  img.src = 'data:image/png;base64,' + imageData;
  
  // AI description (Gemini only)
  console.log('Description:', data.data.text_response);
}`}</pre>
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
