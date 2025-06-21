
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Image, FileText, Video, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function ModeratorPage() {
  const [contentType, setContentType] = useState("text");
  const [content, setContent] = useState("");
  const [responseType, setResponseType] = useState("boolean");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkContent = async () => {
    if (!content.trim()) return;

    setIsChecking(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        type: responseType,
        ...(customPrompt && { prompt: customPrompt })
      });

      if (contentType === "text") {
        params.append("q", content);
      } else if (contentType === "image") {
        params.append("i", content);
      } else if (contentType === "video") {
        params.append("v", content);
      }

      const response = await fetch(`/api/check?${params}`);
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setResult({ error: data.error });
      }
    } catch (error) {
      setResult({ error: "Network error occurred" });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = (status: any) => {
    if (typeof status === "boolean") {
      return status ? "text-green-600" : "text-red-600";
    }
    const percentage = parseInt(status.replace("%", ""));
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
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
                <Shield className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">AI Content Moderator</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Content Moderation
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Advanced content moderation using AI to analyze text, images, and videos for safety and appropriateness.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="moderator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="moderator">Moderator</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="api">API Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="moderator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Content Moderation
                  </CardTitle>
                  <CardDescription>
                    Analyze content for safety and appropriateness using AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="content-type">Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Text Content
                          </div>
                        </SelectItem>
                        <SelectItem value="image">
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            Image URL
                          </div>
                        </SelectItem>
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Video URL
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="content">
                      {contentType === "text" ? "Text to Analyze" : `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} URL`}
                    </Label>
                    {contentType === "text" ? (
                      <Textarea
                        id="content"
                        placeholder="Enter the text content you want to moderate..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                      />
                    ) : (
                      <Input
                        id="content"
                        type="url"
                        placeholder={`https://example.com/${contentType === "image" ? "image.jpg" : "video.mp4"}`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="response-type">Response Type</Label>
                    <Select value={responseType} onValueChange={setResponseType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boolean">Boolean (Safe/Unsafe)</SelectItem>
                        <SelectItem value="yuzdeli">Percentage Score</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="custom-prompt">Custom Rules (Optional)</Label>
                    <Input
                      id="custom-prompt"
                      placeholder="e.g., Allow nudity but block violence"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={checkContent} 
                    disabled={!content.trim() || isChecking}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isChecking ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Analyzing Content...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Moderate Content
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
                        <>
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <span className="text-red-600">Error</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Moderation Result
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Content Type</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {result.content_type || contentType}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Safety Status</h4>
                            <p className={`text-sm font-medium ${getStatusColor(result.moderation?.status)}`}>
                              {typeof result.moderation?.status === "boolean" 
                                ? (result.moderation.status ? "Safe ✓" : "Unsafe ✗")
                                : result.moderation?.status || "Unknown"
                              }
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">AI Analysis</h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {result.moderation?.comment || "No detailed analysis available"}
                          </p>
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
                  <CardTitle>Moderation Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Text Moderation</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Input: "This is a normal conversation"<br/>
                      Output: Safe ✓ - "Content appears appropriate"
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Image Safety Check</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Input: Family photo URL<br/>
                      Output: 95% Safe - "Family-friendly content detected"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Custom Rules</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm">
                      Rules: "Block violence but allow educational content"<br/>
                      Output: Context-specific analysis based on custom criteria
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
                    <pre>{`// Text moderation
const response = await fetch('/api/check?q=' + 
  encodeURIComponent('Content to check') + '&type=boolean');

// Image moderation
const response = await fetch('/api/check?i=' + 
  encodeURIComponent('https://example.com/image.jpg') + 
  '&type=yuzdeli');

// Video moderation with custom rules
const response = await fetch('/api/check?v=' + 
  encodeURIComponent('https://youtube.com/watch?v=example') + 
  '&prompt=' + encodeURIComponent('Custom moderation rules'));

const data = await response.json();
console.log('Moderation result:', data.data.moderation);`}</pre>
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
