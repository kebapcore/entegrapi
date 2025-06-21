
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Play, Download, Loader2, Volume2, FileAudio, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedPodcast {
  audioUrl: string;
  text: string;
  duration: string;
  voice: string;
  expiresIn: string;
}

export default function PromptToPodcastPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("Zephyr");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPodcast, setGeneratedPodcast] = useState<GeneratedPodcast | null>(null);
  const { toast } = useToast();

  const voices = [
    { id: "Zephyr", name: "Zephyr (Natural Voice)", accent: "Multi-Language" },
    { id: "Puck", name: "Puck (Expressive Voice)", accent: "Multi-Language" },
    { id: "Charon", name: "Charon (Deep Voice)", accent: "Multi-Language" },
    { id: "Kore", name: "Kore (Warm Voice)", accent: "Multi-Language" },
    { id: "Fenrir", name: "Fenrir (Strong Voice)", accent: "Multi-Language" },
    { id: "Leda", name: "Leda (Gentle Voice)", accent: "Multi-Language" },
    { id: "Orus", name: "Orus (Clear Voice)", accent: "Multi-Language" },
    { id: "Aoede", name: "Aoede (Musical Voice)", accent: "Multi-Language" },
    { id: "Callirrhoe", name: "Callirrhoe (Flowing Voice)", accent: "Multi-Language" },
    { id: "Autonoe", name: "Autonoe (Bright Voice)", accent: "Multi-Language" },
    { id: "Enceladus", name: "Enceladus (Calm Voice)", accent: "Multi-Language" },
    { id: "Iapetus", name: "Iapetus (Steady Voice)", accent: "Multi-Language" }
  ];

  const examplePrompts = [
    "Create a 3-minute podcast about the future of artificial intelligence in healthcare",
    "Generate a tech news podcast discussing the latest developments in quantum computing",
    "Make a lifestyle podcast about sustainable living tips for beginners",
    "Create an educational podcast explaining blockchain technology in simple terms",
    "Generate a motivational podcast about overcoming challenges in entrepreneurship",
    "Create a history podcast about ancient civilizations and their technologies",
    "Make a science podcast explaining how the human brain works",
    "Generate a business podcast about startup funding and venture capital"
  ];

  const generatePodcast = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for your podcast",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Use the AI TTS API with direct prompt-to-audio conversion
      const response = await fetch(`/api/ai/tts?ai=${encodeURIComponent(prompt)}&name=${selectedVoice}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to generate podcast');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Podcast generation failed');
      }

      // Calculate approximate duration from text length
      const wordCount = data.data.text.split(' ').length;
      const estimatedMinutes = Math.ceil(wordCount / 150); // Average speaking rate
      const estimatedSeconds = Math.round((wordCount % 150) / 150 * 60);
      const duration = `${estimatedMinutes}:${String(estimatedSeconds).padStart(2, '0')}`;

      setGeneratedPodcast({
        audioUrl: data.data.audio_url,
        text: data.data.text,
        duration: duration,
        voice: voices.find(v => v.id === selectedVoice)?.name || selectedVoice,
        expiresIn: data.data.expires_in || "5 minutes"
      });

      toast({
        title: "Success",
        description: "Your AI-powered podcast has been generated successfully!",
      });

    } catch (error) {
      console.error('Podcast generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate podcast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudio = () => {
    if (generatedPodcast?.audioUrl) {
      const link = document.createElement('a');
      link.href = generatedPodcast.audioUrl;
      link.download = `podcast-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Mic className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AI Podcast Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform any idea into a professional podcast using AI. Simply enter a topic 
            and get a complete audio podcast with natural voice narration in seconds.
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
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Your AI Podcast
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Podcast Topic or Prompt
                    </label>
                    <Textarea
                      placeholder="Enter any topic or detailed prompt for your podcast..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px]"
                      disabled={isGenerating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Voice Selection
                    </label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={isGenerating}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            <div className="flex flex-col">
                              <span>{voice.name}</span>
                              <span className="text-xs text-gray-500">{voice.accent}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generatePodcast} 
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating AI Podcast...
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Generate Podcast with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Content */}
              {generatedPodcast && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileAudio className="w-5 h-5" />
                        Your AI-Generated Podcast
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="secondary">
                          {generatedPodcast.duration}
                        </Badge>
                        <Badge variant="outline">
                          {generatedPodcast.voice}
                        </Badge>
                        <Badge variant="destructive" className="text-xs">
                          Expires in {generatedPodcast.expiresIn}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="audio" className="w-full">
                      <TabsList>
                        <TabsTrigger value="audio">Audio Player</TabsTrigger>
                        <TabsTrigger value="transcript">AI-Generated Script</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="audio" className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <audio 
                            controls 
                            className="w-full"
                            src={generatedPodcast.audioUrl}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={downloadAudio} variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download Audio File
                          </Button>
                          <Button variant="ghost" disabled>
                            <Volume2 className="w-4 h-4 mr-2" />
                            Generated with AI
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="transcript">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">
                            {generatedPodcast.text}
                          </pre>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Example Podcast Prompts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {examplePrompts.map((example, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => !isGenerating && setPrompt(example)}
                      >
                        <p className="text-sm">{example}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>API Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
                    <pre>{`// Single API call for AI-generated podcast
const response = await fetch('/api/ai/tts?ai=' + 
  encodeURIComponent('Your podcast prompt here') + 
  '&name=Zephyr');

const data = await response.json();

// Result: Complete AI podcast ready for playback
console.log({
  audioUrl: data.data.audio_url,      // Direct audio file URL
  generatedText: data.data.text,      // AI-generated script
  voice: data.data.voice,             // Voice used
  expiresIn: data.data.expires_in     // Auto-cleanup time
});

// The audio file is automatically saved to temp/
// and will be deleted after 5 minutes for security`}</pre>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Single API call generates both script and audio</li>
                      <li>• Temporary file storage with auto-cleanup</li>
                      <li>• Multiple voice options available</li>
                      <li>• Direct audio URL for immediate playback</li>
                      <li>• No separate TTS step required</li>
                    </ul>
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
