import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  aiRequestSchema, 
  ttsRequestSchema, 
  wikiRequestSchema, 
  tdkRequestSchema, 
  ytRequestSchema,
  urlContextRequestSchema,
  translateRequestSchema,
  ytChannelRequestSchema,
  movieRequestSchema,
  currencyRequestSchema,
  earthquakeLatestRequestSchema,
  earthquakeLastRequestSchema,
  videoRequestSchema,
  weatherRequestSchema,
  imageGenerationRequestSchema,
  ipCheckRequestSchema,
  contentCheckRequestSchema,
  autoSubRequestSchema,
  imageCheckRequestSchema,
  screenshotRequestSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

  if (!GEMINI_API_KEY) {
    console.warn("Warning: No Gemini API key found. AI endpoints will fail without user-provided keys.");
  }

  // Serve temp audio files statically
  const path = await import('path');
  app.use('/temp', express.static(path.join(process.cwd(), 'temp')));

  // Helper function to get appropriate Gemini API key
  const getGeminiApiKey = (userKey?: string): string => {
    // If user provides a key and it's not the system default, use it
    if (userKey && userKey !== "system_default_key") {
      return userKey;
    }
    // Otherwise use system key from environment
    return GEMINI_API_KEY;
  };

  // Helper function to process AI analysis
  const processAIAnalysis = async (
    prompt: string, 
    dataContext: any, 
    model: string = "gemini-2.5-flash", 
    key?: string
  ) => {
    const geminiApiKey = getGeminiApiKey(key);

    if (!geminiApiKey) {
      throw new Error("No Gemini API key available for AI processing");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

    const contextText = `Veri konteksti: ${JSON.stringify(dataContext, null, 2)}`;
    const fullPrompt = `${contextText}\n\nKullanıcı sorusu: ${prompt}`;

    const requestBody = {
      contents: [{ parts: [{ text: fullPrompt }] }],
      system_instruction: {
        parts: [{ text: "Sen verilen veri kontekstini kullanarak kullanıcının sorularını yanıtlayan bir asistansın. Verileri analiz et ve anlamlı içgörüler sun." }]
      }
    };

    const response = await makeGeminiRequest(url, requestBody, geminiApiKey);
    return response.candidates?.[0]?.content?.parts?.[0]?.text || "AI analizi başarısız oldu";
  };

  // Helper function to make Gemini API calls
  const makeGeminiRequest = async (url: string, body: any, apiKey: string) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  };

  // AI Text Generation Endpoint
  app.get("/api/ai", async (req, res) => {
    try {
      const validation = aiRequestSchema.safeParse(req.query);
      if (!validation.success) {
        await storage.logApiUsage({
          endpoint: "/api/ai",
          apiKey: null,
          success: false,
          errorMessage: "Invalid request parameters"
        });
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { query, image, video, model, system, key } = validation.data;
      const geminiApiKey = getGeminiApiKey(key);

      if (!geminiApiKey) {
        await storage.logApiUsage({
          endpoint: "/api/ai",
          apiKey: key || null,
          success: false,
          errorMessage: "No Gemini API key available"
        });
        return res.status(500).json({
          success: false,
          error: "No Gemini API key available"
        });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

      const parts: any[] = [{ text: query }];
      if (image) {
        parts.push({
          inline_data: {
            mime_type: "image/jpeg",
            data: image
          }
        });
      }
      if (video) {
        parts.push({
          file_data: {
            file_uri: video
          }
        });
      }

      const requestBody = {
        contents: [{ parts }],
        ...(system && {
          system_instruction: {
            parts: [{ text: system }]
          }
        })
      };

      const geminiResponse = await makeGeminiRequest(url, requestBody, geminiApiKey);

      const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
      const usage = geminiResponse.usageMetadata || {};

      await storage.logApiUsage({
        endpoint: "/api/ai",
        apiKey: key || null,
        success: true,
        errorMessage: null
      });

      res.json({
        success: true,
        data: {
          response: responseText,
          model,
          usage: {
            input_tokens: usage.promptTokenCount || 0,
            output_tokens: usage.candidatesTokenCount || 0
          }
        }
      });

    } catch (error) {
      await storage.logApiUsage({
        endpoint: "/api/ai",
        apiKey: req.query.key as string || null,
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error"
      });

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // AI Text-to-Speech Endpoint
  app.get("/api/ai/tts", async (req, res) => {
    try {
      const validation = ttsRequestSchema.safeParse(req.query);
      if (!validation.success) {
        await storage.logApiUsage({
          endpoint: "/api/ai/tts",
          apiKey: null,
          success: false,
          errorMessage: "Invalid request parameters"
        });
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { query, ai, name = "Zephyr", model, key } = validation.data;
      const geminiApiKey = getGeminiApiKey(key);

      if (!geminiApiKey) {
        await storage.logApiUsage({
          endpoint: "/api/ai/tts",
          apiKey: key || null,
          success: false,
          errorMessage: "No Gemini API key available"
        });
        return res.status(500).json({
          success: false,
          error: "No Gemini API key available"
        });
      }

      let textToSpeak = query;

      // If ai parameter is provided, generate text first
      if (ai) {
        const textGenUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
        const textGenBody = {
          contents: [{ parts: [{ text: ai }] }],
          system_instruction: {
            parts: [{ text: "Sen bir içerik üretici botusun. Kullanıcının isteğine göre doğal, akıcı ve ilginç metinler yazarsın. Podcast, hikaye, açıklama vs. her türlü metin türünde ustasın. Sadece istenen metni üret, ek açıklama yapma. Sadece metin değil, konuşmak için konuşma üretiyorsun. Her zaman tek bir konuşmacı olmalı, ve giriş müziği yükselir gibi ifadeler kullanma. Yazdığın şeyler direkt olarak seslendirilecek. Parantez içinde durum kullanma. Parantez içinde yazdığın şeylerde seslendirilir. Mesela nefes nefese koşan biri varsa hıı hıı.. huh.. yaz parantez içinde (nefes nefese koşuyorum) yazma. Sana bir kişi 'lunaparkta korkan adam neyden korktuğunu anlatıyor' derse direkt 'arkadaşlar bugün lunaparktaydım...' diye yazmaya başlayacaksın. Direkt onun söylemlerini. Ve tekrar söylüyorum. Tek bir konuşmacı olacak. ve her şeyden bir konuşma üreteceksin. Kişi saçma sapan bir random atsa bile onu bir seslendirmeye dönüştür. Ve son olarak kişi hangi dilde istediyse o dilde yaz. İngilizce olarak prompt yazdıysa ingilizce yaz, ingilizce prompt verip 'türkçe dilinde yaz' diyorsa türkçe dilinde yaz falan..." }]
          }
        };

        const textGenResponse = await makeGeminiRequest(textGenUrl, textGenBody, geminiApiKey);
        textToSpeak = textGenResponse.candidates?.[0]?.content?.parts?.[0]?.text || "Metin üretimi başarısız oldu";
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${geminiApiKey}`;

      const requestBody = {
        contents: [{ parts: [{ text: textToSpeak }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: name
              }
            }
          }
        }
      };

      const geminiResponse = await makeGeminiRequest(url, requestBody, geminiApiKey);

      const audioData = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!audioData) {
        throw new Error("No audio data received from Gemini API");
      }

      // Save audio file to local storage
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Create temp directory if it doesn't exist
      const tempDir = path.join(process.cwd(), 'temp');
      try {
        await fs.mkdir(tempDir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }

      // Generate unique filename
      const fileName = `tts_${Date.now()}_${Math.random().toString(36).substring(2)}.wav`;
      const filePath = path.join(tempDir, fileName);
      
      // Convert base64 to PCM buffer
      const pcmBuffer = Buffer.from(audioData, 'base64');
      
      // Create proper WAV header for 24kHz, 16-bit, mono PCM
      const sampleRate = 24000;
      const bitsPerSample = 16;
      const channels = 1;
      const byteRate = sampleRate * channels * (bitsPerSample / 8);
      const blockAlign = channels * (bitsPerSample / 8);
      const dataSize = pcmBuffer.length;
      const fileSize = 36 + dataSize;
      
      // Create WAV header
      const header = Buffer.alloc(44);
      
      // RIFF chunk descriptor
      header.write('RIFF', 0);
      header.writeUInt32LE(fileSize, 4);
      header.write('WAVE', 8);
      
      // fmt sub-chunk
      header.write('fmt ', 12);
      header.writeUInt32LE(16, 16); // Sub-chunk size
      header.writeUInt16LE(1, 20);  // Audio format (PCM)
      header.writeUInt16LE(channels, 22);
      header.writeUInt32LE(sampleRate, 24);
      header.writeUInt32LE(byteRate, 28);
      header.writeUInt16LE(blockAlign, 32);
      header.writeUInt16LE(bitsPerSample, 34);
      
      // data sub-chunk
      header.write('data', 36);
      header.writeUInt32LE(dataSize, 40);
      
      // Combine header and PCM data
      const wavBuffer = Buffer.concat([header, pcmBuffer]);
      await fs.writeFile(filePath, wavBuffer);

      // Create public URL
      const audioUrl = `/temp/${fileName}`;

      // Schedule file deletion after 5 minutes
      setTimeout(async () => {
        try {
          await fs.unlink(filePath);
          console.log(`Deleted TTS file: ${fileName}`);
        } catch (error) {
          console.warn(`Failed to delete TTS file ${fileName}:`, error);
        }
      }, 5 * 60 * 1000); // 5 minutes

      await storage.logApiUsage({
        endpoint: "/api/ai/tts",
        apiKey: key || null,
        success: true,
        errorMessage: null
      });

      res.json({
        success: true,
        data: {
          audio_url: audioUrl,
          duration: 2.5,
          voice: name,
          text: textToSpeak,
          generated_from_ai: !!ai,
          expires_in: "5 minutes"
        }
      });

    } catch (error) {
      await storage.logApiUsage({
        endpoint: "/api/ai/tts",
        apiKey: req.query.key as string || null,
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error"
      });

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Wikipedia API Endpoint (Enhanced)
  app.get("/api/wiki", async (req, res) => {
    try {
      const validation = wikiRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { q: query, type, lang, ai, model, key } = validation.data;
      let searchUrl: string;
      let responseData: any;

      if (type === "wikiquote") {
        // Wikiquote API call
        searchUrl = `https://${lang}.wikiquote.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      } else {
        // Wikipedia API call
        searchUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      }

      const response = await fetch(searchUrl);

      if (!response.ok) {
        if (response.status === 404) {
          responseData = {
            title: query,
            summary: type === "wikiquote" 
              ? "Bu kişi hakkında Wikiquote'da alıntı bulunamadı." 
              : "Bu konu hakkında Wikipedia'da bilgi bulunamadı.",
            url: null,
            images: [],
            type: type,
            language: lang
          };
        } else {
          throw new Error(`${type === "wikiquote" ? "Wikiquote" : "Wikipedia"} API error: ${response.status}`);
        }
      } else {
        const data = await response.json();
        responseData = {
          title: data.title || query,
          summary: data.extract || "İçerik bulunamadı.",
          url: data.content_urls?.desktop?.page || 
               `https://${lang}.${type === "wikiquote" ? "wikiquote" : "wikipedia"}.org/wiki/${encodeURIComponent(query)}`,
          images: data.thumbnail ? [data.thumbnail.url] : [],
          type: type,
          language: lang
        };
      }

      // Process AI analysis if requested
      let aiAnswer = null;
      if (ai) {
        try {
          aiAnswer = await processAIAnalysis(ai, responseData, model, key);
        } catch (error) {
          // AI processing failed, but we still return the data
          aiAnswer = "AI analizi başarısız oldu: " + (error instanceof Error ? error.message : "Bilinmeyen hata");
        }
      }

      const finalResponse: any = {
        success: true,
        data: responseData
      };

      if (ai) {
        finalResponse.ai_answer = aiAnswer;
      }

      res.json(finalResponse);

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // TDK API Endpoint (Enhanced)
  app.get("/api/tdk", async (req, res) => {
    try {
      const validation = tdkRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { query, ai, model, key } = validation.data;

      // TDK API call
      const tdkUrl = `https://sozluk.gov.tr/gts?ara=${encodeURIComponent(query)}`;
      const response = await fetch(tdkUrl);

      if (!response.ok) {
        throw new Error(`TDK API error: ${response.status}`);
      }

      const data = await response.json();

      let responseData: any;
      if (!data || data.length === 0) {
        responseData = {
          word: query,
          meanings: []
        };
      } else {
        const meanings = data[0].anlamlarListe?.map((anlam: any) => ({
          definition: anlam.anlam || "",
          type: anlam.ozelliklerListe?.[0]?.tam_adi || ""
        })) || [];

        responseData = {
          word: data[0].madde || query,
          meanings
        };
      }

      // Process AI analysis if requested
      let aiAnswer = null;
      if (ai) {
        try {
          aiAnswer = await processAIAnalysis(ai, responseData, model, key);
        } catch (error) {
          aiAnswer = "AI analizi başarısız oldu: " + (error instanceof Error ? error.message : "Bilinmeyen hata");
        }
      }

      const finalResponse: any = {
        success: true,
        data: responseData
      };

      if (ai) {
        finalResponse.ai_answer = aiAnswer;
      }

      res.json(finalResponse);

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // URL Context with Gemini API Endpoint
  app.get("/api/ai/urlcontext", async (req, res) => {
    try {
      const validation = urlContextRequestSchema.safeParse(req.query);
      if (!validation.success) {
        await storage.logApiUsage({
          endpoint: "/api/ai/urlcontext",
          apiKey: null,
          success: false,
          errorMessage: "Invalid request parameters"
        });
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { q: query, model, key } = validation.data;
      const geminiApiKey = getGeminiApiKey(key);

      if (!geminiApiKey) {
        await storage.logApiUsage({
          endpoint: "/api/ai/urlcontext",
          apiKey: key || null,
          success: false,
          errorMessage: "No Gemini API key available"
        });
        return res.status(500).json({
          success: false,
          error: "No Gemini API key available"
        });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

      const requestBody = {
        contents: [{ parts: [{ text: query }] }],
        tools: [{ url_context: {} }]
      };

      const geminiResponse = await makeGeminiRequest(url, requestBody, geminiApiKey);

      const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
      const urlMetadata = geminiResponse.candidates?.[0]?.url_context_metadata || null;

      await storage.logApiUsage({
        endpoint: "/api/ai/urlcontext",
        apiKey: key || null,
        success: true,
        errorMessage: null
      });

      res.json({
        success: true,
        data: {
          response: responseText,
          model,
          url_metadata: urlMetadata
        }
      });

    } catch (error) {
      await storage.logApiUsage({
        endpoint: "/api/ai/urlcontext",
        apiKey: req.query.key as string || null,
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error"
      });

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Translation API Endpoint
  app.get("/api/translate", async (req, res) => {
    try {
      const validation = translateRequestSchema.safeParse(req.query);
      if (!validation.success) {
        await storage.logApiUsage({
          endpoint: "/api/translate",
          apiKey: null,
          success: false,
          errorMessage: "Invalid request parameters"
        });
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { q: query, to: targetLang, key } = validation.data;
      const geminiApiKey = getGeminiApiKey(key);

      if (!geminiApiKey) {
        await storage.logApiUsage({
          endpoint: "/api/translate",
          apiKey: key || null,
          success: false,
          errorMessage: "No Gemini API key available"
        });
        return res.status(500).json({
          success: false,
          error: "No Gemini API key available"
        });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

      const requestBody = {
        contents: [{ parts: [{ text: `'${query}' ifadesini ${targetLang.toUpperCase()} diline çevir.` }] }],
        system_instruction: {
          parts: [{ text: "Sen bir çeviri botusun. tamam anladım gibi ifadeler asla kullanmadan, sadece çevirini basitçe yaparsın. bağlamları anlarsın, anlama göre tutarlı çeviri yaparsın." }]
        }
      };

      const geminiResponse = await makeGeminiRequest(url, requestBody, geminiApiKey);

      const translatedText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "Translation failed";

      await storage.logApiUsage({
        endpoint: "/api/translate",
        apiKey: key || null,
        success: true,
        errorMessage: null
      });

      res.json({
        success: true,
        data: {
          original_text: query,
          translated_text: translatedText,
          source_language: "auto",
          target_language: targetLang
        }
      });

    } catch (error) {
      await storage.logApiUsage({
        endpoint: "/api/translate",
        apiKey: req.query.key as string || null,
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error"
      });

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Movie API Endpoint
  app.get("/api/movie", async (req, res) => {
    try {
      const validation = movieRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { q: movieName, ai, model, key } = validation.data;

      // Using OMDb API (free, no key required for basic info)
      const omdbUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=trilogy`;
      const response = await fetch(omdbUrl);

      if (!response.ok) {
        throw new Error(`Movie API error: ${response.status}`);
      }

      const data = await response.json();

      let responseData: any;
      if (data.Response === "False") {
        responseData = {
          title: movieName,
          found: false,
          error: data.Error || "Film bulunamadı"
        };
      } else {
        responseData = {
          title: data.Title || movieName,
          year: data.Year || "Bilinmiyor",
          rating: {
            imdb: data.imdbRating || "N/A",
            metascore: data.Metascore || "N/A"
          },
          genre: data.Genre || "Bilinmiyor",
          director: data.Director || "Bilinmiyor",
          actors: data.Actors || "Bilinmiyor",
          plot: data.Plot || "Açıklama bulunamadı",
          poster: data.Poster !== "N/A" ? data.Poster : null,
          runtime: data.Runtime || "Bilinmiyor",
          language: data.Language || "Bilinmiyor",
          country: data.Country || "Bilinmiyor",
          found: true
        };
      }

      // Process AI analysis if requested
      let aiAnswer = null;
      if (ai) {
        try {
          aiAnswer = await processAIAnalysis(ai, responseData, model, key);
        } catch (error) {
          aiAnswer = "AI analizi başarısız oldu: " + (error instanceof Error ? error.message : "Bilinmeyen hata");
        }
      }

      const finalResponse: any = {
        success: true,
        data: responseData
      };

      if (ai) {
        finalResponse.ai_answer = aiAnswer;
      }

      res.json(finalResponse);

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Earthquake Latest API Endpoint
  app.get("/api/earthquake/latest", async (req, res) => {
    try {
      const validation = earthquakeLatestRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { country, ai, model, key } = validation.data;

      let earthquakeUrl: string;
      let responseData: any;

      // Use different APIs based on country
      if (country.toLowerCase() === 'tr' || country.toLowerCase() === 'turkey') {
        // AFAD Turkey earthquake data
        earthquakeUrl = 'https://deprem.afad.gov.tr/EventData/GetLast50Event';

        try {
          const response = await fetch(earthquakeUrl);
          if (!response.ok) {
            throw new Error(`AFAD API error: ${response.status}`);
          }

          const data = await response.json();

          if (!data || data.length === 0) {
            responseData = {
              country: country,
              found: false,
              error: "AFAD'dan son deprem verisi bulunamadı"
            };
          } else {
            const earthquake = data[0];
            responseData = {
              country: country,
              found: true,
              earthquake: {
                magnitude: earthquake.magnitude || earthquake.mag || "Bilinmiyor",
                location: earthquake.location || earthquake.place || "Bilinmiyor", 
                time: earthquake.eventDate || earthquake.time || "Bilinmiyor",
                depth: earthquake.depth || "Bilinmiyor",
                coordinates: {
                  latitude: earthquake.latitude || earthquake.lat || "Bilinmiyor",
                  longitude: earthquake.longitude || earthquake.lng || "Bilinmiyor"
                },
                source: "AFAD"
              }
            };
          }
        } catch (error) {
          // Fallback to USGS for Turkey
          earthquakeUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=1&orderby=time&minlatitude=35&maxlatitude=43&minlongitude=25&maxlongitude=45`;
          const response = await fetch(earthquakeUrl);
          const data = await response.json();

          if (!data.features || data.features.length === 0) {
            responseData = {
              country: country,
              found: false,
              error: "Türkiye için deprem verisi bulunamadı"
            };
          } else {
            const earthquake = data.features[0];
            const coords = earthquake.geometry.coordinates;
            responseData = {
              country: country,
              found: true,
              earthquake: {
                magnitude: earthquake.properties.mag || "Bilinmiyor",
                location: earthquake.properties.place || "Bilinmiyor",
                time: new Date(earthquake.properties.time).toISOString(),
                depth: coords[2] || "Bilinmiyor",
                coordinates: {
                  latitude: coords[1],
                  longitude: coords[0]
                },
                source: "USGS"
              }
            };
          }
        }
      } else {
        // Use USGS for other countries
        earthquakeUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=1&orderby=time`;
        const response = await fetch(earthquakeUrl);

        if (!response.ok) {
          throw new Error(`USGS API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.features || data.features.length === 0) {
          responseData = {
            country: country,
            found: false,
            error: "Son deprem verisi bulunamadı"
          };
        } else {
          const earthquake = data.features[0];
          const coords = earthquake.geometry.coordinates;

          responseData = {
            country: country,
            found: true,
            earthquake: {
              magnitude: earthquake.properties.mag || "Bilinmiyor",
              location: earthquake.properties.place || "Bilinmiyor",
              time: new Date(earthquake.properties.time).toISOString(),
              depth: coords[2] || "Bilinmiyor",
              coordinates: {
                latitude: coords[1],
                longitude: coords[0]
              },
              source: "USGS"
            }
          };
        }
      }

      // Process AI analysis if requested
      let aiAnswer = null;
      if (ai) {
        try {
          aiAnswer = await processAIAnalysis(ai, responseData, model, key);
        } catch (error) {
          aiAnswer = "AI analizi başarısız oldu: " + (error instanceof Error ? error.message : "Bilinmeyen hata");
        }
      }

      const finalResponse: any = {
        success: true,
        data: responseData
      };

      if (ai) {
        finalResponse.ai_answer = aiAnswer;
      }

      res.json(finalResponse);

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Earthquake Last N API Endpoint
  app.get("/api/earthquake/last", async (req, res) => {
    try {
      const validation = earthquakeLastRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { country, limit, ai, model, key } = validation.data;

      let earthquakeUrl: string;
      let responseData: any;

      // Use different APIs based on country
      if (country.toLowerCase() === 'tr' || country.toLowerCase() === 'turkey') {
        // AFAD Turkey earthquake data
        earthquakeUrl = 'https://deprem.afad.gov.tr/EventData/GetLast50Event';

        try {
          const response = await fetch(earthquakeUrl);
          if (!response.ok) {
            throw new Error(`AFAD API error: ${response.status}`);
          }

          const data = await response.json();

          if (!data || data.length === 0) {
            responseData = {
              country: country,
              limit: limit,
              found: false,
              count: 0,
              earthquakes: []
            };
          } else {
            const earthquakes = data.slice(0, limit).map((earthquake: any) => ({
              magnitude: earthquake.magnitude || earthquake.mag || "Bilinmiyor",
              location: earthquake.location || earthquake.place || "Bilinmiyor",
              time: earthquake.eventDate || earthquake.time || "Bilinmiyor",
              depth: earthquake.depth || "Bilinmiyor",
              coordinates: {
                latitude: earthquake.latitude || earthquake.lat || "Bilinmiyor",
                longitude: earthquake.longitude || earthquake.lng || "Bilinmiyor"
              },
              source: "AFAD"
            }));

            responseData = {
              country: country,
              limit: limit,
              found: true,
              count: earthquakes.length,
              earthquakes
            };
          }
        } catch (error) {
          // Fallback to USGS for Turkey
          earthquakeUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=${limit}&orderby=time&minlatitude=35&maxlatitude=43&minlongitude=25&maxlongitude=45`;
          const response = await fetch(earthquakeUrl);
          const data = await response.json();

          const earthquakes = data.features?.map((earthquake: any) => {
            const coords = earthquake.geometry.coordinates;
            return {
              magnitude: earthquake.properties.mag || "Bilinmiyor",
              location: earthquake.properties.place || "Bilinmiyor",
              time: new Date(earthquake.properties.time).toISOString(),
              depth: coords[2] || "Bilinmiyor",
              coordinates: {
                latitude: coords[1],
                longitude: coords[0]
              },
              source: "USGS"
            };
          }) || [];

          responseData = {
            country: country,
            limit: limit,
            found: earthquakes.length > 0,
            count: earthquakes.length,
            earthquakes
          };
        }
      } else {
        // Use USGS for other countries
        earthquakeUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=${limit}&orderby=time`;
        const response = await fetch(earthquakeUrl);

        if (!response.ok) {
          throw new Error(`USGS API error: ${response.status}`);
        }

        const data = await response.json();

        const earthquakes = data.features?.map((earthquake: any) => {
          const coords = earthquake.geometry.coordinates;
          return {
            magnitude: earthquake.properties.mag || "Bilinmiyor",
            location: earthquake.properties.place || "Bilinmiyor",
            time: new Date(earthquake.properties.time).toISOString(),
            depth: coords[2] || "Bilinmiyor",
            coordinates: {
              latitude: coords[1],
              longitude: coords[0]
            },
            source: "USGS"
          };
        }) || [];

        responseData = {
          country: country,
          limit: limit,
          found: earthquakes.length > 0,
          count: earthquakes.length,
          earthquakes
        };
      }

      // Process AI analysis if requested
      let aiAnswer = null;
      if (ai) {
        try {
          aiAnswer = await processAIAnalysis(ai, responseData, model, key);
        } catch (error) {
          aiAnswer = "AI analizi başarısız oldu: " + (error instanceof Error ? error.message : "Bilinmeyen hata");
        }
      }

      const finalResponse: any = {
        success: true,
        data: responseData
      };

      if (ai) {        finalResponse.ai_answer = aiAnswer;
      }

      res.json(finalResponse);

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Currency Exchange API Endpoint
  app.get("/api/currency", async (req, res) => {
    try {
      const validation = currencyRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { q: fromCurrency, to: toCurrency, ai, model, key } = validation.data;

      // Using exchangerate-api.com (free tier available)
      const exchangeUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency.toUpperCase()}`;
      const response = await fetch(exchangeUrl);

      if (!response.ok) {
        throw new Error(`Currency API error: ${response.status}`);
      }

      const data = await response.json();

      let responseData: any;
      const targetCurrency = toCurrency.toUpperCase();

      if (!data.rates || !data.rates[targetCurrency]) {
        responseData = {
          from: fromCurrency.toUpperCase(),
          to: targetCurrency,
          rate: null,
          error: "Döviz kuru bulunamadı",
          found: false
        };
      } else {
        responseData = {
          from: fromCurrency.toUpperCase(),
          to: targetCurrency,
          rate: data.rates[targetCurrency],
          date: data.date,
          base: data.base,
          found: true
        };
      }

      // Process AI analysis if requested
      let aiAnswer = null;
      if (ai) {
        try {
          aiAnswer = await processAIAnalysis(ai, responseData, model, key);
        } catch (error) {
          aiAnswer = "AI analizi başarısız oldu: " + (error instanceof Error ? error.message : "Bilinmeyen hata");
        }
      }

      const finalResponse: any = {
        success: true,
        data: responseData
      };

      if (ai) {
        finalResponse.ai_answer = aiAnswer;
      }

      res.json(finalResponse);

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // YouTube API Endpoint (Enhanced with multiple fallback methods)
  app.get("/api/yt", async (req, res) => {
    try {
      const validation = ytRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { link, ai, model, key } = validation.data;

      // Extract video ID from URL
      const videoIdMatch = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (!videoIdMatch) {
        return res.status(400).json({
          success: false,
          error: "Invalid YouTube URL"
        });
      }

      const videoId = videoIdMatch[1];
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Helper functions
      const formatDuration = (seconds: number) => {
        if (!seconds) return "Bilinmiyor";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
      };

      const formatViewCount = (count: number) => {
        if (!count) return "Bilinmiyor";
        if (count >= 1000000) {
          return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
          return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
      };

      // Method 1: Try yt-dlp (primary method)
      const tryYtDlp = async () => {
        const { spawn } = await import('child_process');

        const getVideoInfo = () => {
          return new Promise<any>((resolve, reject) => {
            const ytdlp = spawn('yt-dlp', ['-j', '--no-warnings', videoUrl], {
              timeout: 30000 // 30 second timeout
            });
            let jsonData = '';
            
            ytdlp.stdout.on('data', (data) => {
              jsonData += data.toString();
            });
            
            ytdlp.on('close', (code) => {
              if (code === 0 && jsonData.trim()) {
                try {
                  const videoInfo = JSON.parse(jsonData.trim());
                  resolve(videoInfo);
                } catch (parseError) {
                  reject(parseError);
                }
              } else {
                reject(new Error(`yt-dlp info extraction failed with code ${code}`));
              }
            });
            
            ytdlp.on('error', (error) => reject(error));
          });
        };

        const getDownloadUrls = () => {
          return new Promise<{mp3_url: string | null, mp4_url: string | null}>((resolve) => {
            const ytdlp = spawn('yt-dlp', ['-g', '-f', 'bestvideo+bestaudio', '--no-warnings', videoUrl], {
              timeout: 30000
            });
            let urlData = '';
            
            ytdlp.stdout.on('data', (data) => {
              urlData += data.toString();
            });
            
            ytdlp.on('close', (code) => {
              if (code === 0 && urlData.trim()) {
                const urls = urlData.trim().split('\n').filter(url => url.trim());
                resolve({
                  mp4_url: urls[0] || null,
                  mp3_url: urls[1] || urls[0] || null
                });
              } else {
                // Fallback to audio only
                const audioYtdlp = spawn('yt-dlp', ['-g', '-f', 'bestaudio', '--no-warnings', videoUrl], {
                  timeout: 15000
                });
                let audioUrlData = '';
                
                audioYtdlp.stdout.on('data', (data) => {
                  audioUrlData += data.toString();
                });
                
                audioYtdlp.on('close', (audioCode) => {
                  resolve({
                    mp3_url: audioCode === 0 && audioUrlData.trim() ? audioUrlData.trim() : null,
                    mp4_url: null
                  });
                });
                
                audioYtdlp.on('error', () => {
                  resolve({ mp3_url: null, mp4_url: null });
                });
              }
            });
            
            ytdlp.on('error', () => {
              resolve({ mp3_url: null, mp4_url: null });
            });
          });
        };

        const [videoInfo, downloadUrls] = await Promise.all([
          getVideoInfo(),
          getDownloadUrls()
        ]);

        return {
          video_id: videoId,
          title: videoInfo.title || "Başlık bulunamadı",
          description: videoInfo.description || "Açıklama bulunamadı",
          duration: formatDuration(videoInfo.duration),
          duration_seconds: videoInfo.duration || 0,
          view_count: formatViewCount(videoInfo.view_count),
          view_count_raw: videoInfo.view_count || 0,
          like_count: videoInfo.like_count || 0,
          upload_date: videoInfo.upload_date || "Bilinmiyor",
          uploader: videoInfo.uploader || videoInfo.channel || "Bilinmiyor",
          thumbnail: videoInfo.thumbnail || "",
          webpage_url: videoInfo.webpage_url || videoUrl,
          mp3_url: downloadUrls.mp3_url,
          mp4_url: downloadUrls.mp4_url,
          download_status: (downloadUrls.mp3_url || downloadUrls.mp4_url) ? "available" : "failed",
          channel: {
            id: videoInfo.channel_id || "Bilinmiyor",
            name: videoInfo.channel || videoInfo.uploader || "Bilinmiyor",
            url: videoInfo.channel_url || videoInfo.uploader_url || "",
            subscriber_count: videoInfo.channel_follower_count || 0,
            verified: videoInfo.channel_is_verified || false
          },
          resolution: videoInfo.resolution || "Bilinmiyor",
          fps: videoInfo.fps || 0,
          filesize: videoInfo.filesize || 0,
          format_id: videoInfo.format_id || "Bilinmiyor",
          categories: videoInfo.categories || [],
          tags: videoInfo.tags || [],
          age_restricted: videoInfo.age_limit ? videoInfo.age_limit > 0 : false,
          age_limit: videoInfo.age_limit || 0,
          extraction_method: "yt-dlp",
          extracted_at: new Date().toISOString()
        };
      };

      // Method 2: Try youtube-dl (alternative to yt-dlp)
      const tryYoutubeDl = async () => {
        const { spawn } = await import('child_process');

        const getVideoInfoYoutubeDl = () => {
          return new Promise<any>((resolve, reject) => {
            const youtubedl = spawn('youtube-dl', ['-j', '--no-warnings', videoUrl], {
              timeout: 30000
            });
            let jsonData = '';
            
            youtubedl.stdout.on('data', (data) => {
              jsonData += data.toString();
            });
            
            youtubedl.on('close', (code) => {
              if (code === 0 && jsonData.trim()) {
                try {
                  const videoInfo = JSON.parse(jsonData.trim());
                  resolve(videoInfo);
                } catch (parseError) {
                  reject(parseError);
                }
              } else {
                reject(new Error(`youtube-dl info extraction failed with code ${code}`));
              }
            });
            
            youtubedl.on('error', (error) => reject(error));
          });
        };

        const getDownloadUrlsYoutubeDl = () => {
          return new Promise<{mp3_url: string | null, mp4_url: string | null}>((resolve) => {
            const youtubedl = spawn('youtube-dl', ['-g', '-f', 'best', '--no-warnings', videoUrl], {
              timeout: 30000
            });
            let urlData = '';
            
            youtubedl.stdout.on('data', (data) => {
              urlData += data.toString();
            });
            
            youtubedl.on('close', (code) => {
              const url = code === 0 && urlData.trim() ? urlData.trim() : null;
              resolve({
                mp4_url: url,
                mp3_url: url // Same URL can be used for both
              });
            });
            
            youtubedl.on('error', () => {
              resolve({ mp3_url: null, mp4_url: null });
            });
          });
        };

        const [videoInfo, downloadUrls] = await Promise.all([
          getVideoInfoYoutubeDl(),
          getDownloadUrlsYoutubeDl()
        ]);

        return {
          video_id: videoId,
          title: videoInfo.title || "Başlık bulunamadı",
          description: videoInfo.description || "Açıklama bulunamadı",
          duration: formatDuration(videoInfo.duration),
          duration_seconds: videoInfo.duration || 0,
          view_count: formatViewCount(videoInfo.view_count),
          view_count_raw: videoInfo.view_count || 0,
          like_count: videoInfo.like_count || 0,
          upload_date: videoInfo.upload_date || "Bilinmiyor",
          uploader: videoInfo.uploader || "Bilinmiyor",
          thumbnail: videoInfo.thumbnail || "",
          webpage_url: videoUrl,
          mp3_url: downloadUrls.mp3_url,
          mp4_url: downloadUrls.mp4_url,
          download_status: (downloadUrls.mp3_url || downloadUrls.mp4_url) ? "available" : "failed",
          channel: {
            id: videoInfo.id || "Bilinmiyor",
            name: videoInfo.uploader || "Bilinmiyor",
            url: videoInfo.uploader_url || "",
            subscriber_count: 0,
            verified: false
          },
          resolution: "Bilinmiyor",
          fps: 0,
          filesize: 0,
          format_id: videoInfo.format_id || "Bilinmiyor",
          categories: videoInfo.categories || [],
          tags: videoInfo.tags || [],
          age_restricted: false,
          age_limit: 0,
          extraction_method: "youtube-dl",
          extracted_at: new Date().toISOString()
        };
      };

      // Method 3: Use oEmbed API
      const tryOEmbed = async () => {
        const oembedUrl = `https://www.youtube.com/oembed?url=${videoUrl}&format=json`;
        const response = await fetch(oembedUrl);
        
        if (!response.ok) throw new Error(`oEmbed API error: ${response.status}`);
        
        const data = await response.json();
        
        return {
          video_id: videoId,
          title: data.title || "Başlık bulunamadı",
          description: "oEmbed API'den açıklama bilgisi alınamadı",
          duration: "Bilinmiyor",
          duration_seconds: 0,
          view_count: "Bilinmiyor",
          view_count_raw: 0,
          like_count: 0,
          upload_date: "Bilinmiyor",
          uploader: data.author_name || "Bilinmiyor",
          thumbnail: data.thumbnail_url || "",
          webpage_url: videoUrl,
          mp3_url: null,
          mp4_url: null,
          download_status: "unavailable_oembed",
          channel: {
            id: "Bilinmiyor",
            name: data.author_name || "Bilinmiyor",
            url: data.author_url || "",
            subscriber_count: 0,
            verified: false
          },
          resolution: "Bilinmiyor",
          fps: 0,
          filesize: 0,
          format_id: "Bilinmiyor",
          categories: [],
          tags: [],
          age_restricted: false,
          age_limit: 0,
          extraction_method: "oEmbed",
          extracted_at: new Date().toISOString()
        };
      };

      // Method 4: Web scraping fallback
      const tryWebScraping = async () => {
        const response = await fetch(videoUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!response.ok) throw new Error(`Failed to fetch video page: ${response.status}`);
        
        const html = await response.text();
        
        // Extract basic info from HTML
        const titleMatch = html.match(/<title[^>]*>([^<]+)</);
        const descMatch = html.match(/"description":"([^"]+)"/);
        const thumbnailMatch = html.match(/"thumbnails":\[{"url":"([^"]+)"/);
        const channelMatch = html.match(/"ownerChannelName":"([^"]+)"/);
        const viewCountMatch = html.match(/"viewCount":"(\d+)"/);
        const durationMatch = html.match(/"lengthSeconds":"(\d+)"/);
        
        const title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : "Başlık bulunamadı";
        const description = descMatch ? descMatch[1].replace(/\\n/g, '\n') : "Web scraping'den açıklama alınamadı";
        const thumbnail = thumbnailMatch ? thumbnailMatch[1] : "";
        const channel = channelMatch ? channelMatch[1] : "Bilinmiyor";
        const viewCount = viewCountMatch ? parseInt(viewCountMatch[1]) : 0;
        const durationSeconds = durationMatch ? parseInt(durationMatch[1]) : 0;
        
        return {
          video_id: videoId,
          title: title,
          description: description,
          duration: formatDuration(durationSeconds),
          duration_seconds: durationSeconds,
          view_count: formatViewCount(viewCount),
          view_count_raw: viewCount,
          like_count: 0,
          upload_date: "Bilinmiyor",
          uploader: channel,
          thumbnail: thumbnail,
          webpage_url: videoUrl,
          mp3_url: null,
          mp4_url: null,
          download_status: "unavailable_scraping",
          channel: {
            id: "Bilinmiyor",
            name: channel,
            url: "",
            subscriber_count: 0,
            verified: false
          },
          resolution: "Bilinmiyor",
          fps: 0,
          filesize: 0,
          format_id: "Bilinmiyor",
          categories: [],
          tags: [],
          age_restricted: false,
          age_limit: 0,
          extraction_method: "web_scraping",
          extracted_at: new Date().toISOString()
        };
      };

      // Try methods in order with fallbacks
      let responseData;
      let extractionError = "";

      try {
        // First try yt-dlp
        console.log("Trying yt-dlp...");
        responseData = await tryYtDlp();
      } catch (ytdlpError) {
        console.warn("yt-dlp failed:", ytdlpError);
        extractionError += `yt-dlp: ${ytdlpError instanceof Error ? ytdlpError.message : 'Unknown error'} | `;
        
        try {
          // Then try youtube-dl
          console.log("Trying youtube-dl...");
          responseData = await tryYoutubeDl();
        } catch (youtubedlError) {
          console.warn("youtube-dl failed:", youtubedlError);
          extractionError += `youtube-dl: ${youtubedlError instanceof Error ? youtubedlError.message : 'Unknown error'} | `;
          
          try {
            // Then try oEmbed
            console.log("Trying oEmbed...");
            responseData = await tryOEmbed();
          } catch (oembedError) {
            console.warn("oEmbed failed:", oembedError);
            extractionError += `oEmbed: ${oembedError instanceof Error ? oembedError.message : 'Unknown error'} | `;
            
            try {
              // Finally try web scraping
              console.log("Trying web scraping...");
              responseData = await tryWebScraping();
            } catch (scrapingError) {
              console.error("All methods failed:", scrapingError);
              extractionError += `scraping: ${scrapingError instanceof Error ? scrapingError.message : 'Unknown error'}`;
              throw new Error(`All extraction methods failed: ${extractionError}`);
            }
          }
        }
      }

      // Add error info if any method failed
      if (extractionError) {
        responseData.fallback_info = {
          failed_methods: extractionError,
          note: "Some extraction methods failed, but we found alternative data"
        };
      }

      // Process AI analysis if requested
      let aiAnswer = null;
      if (ai) {
        try {
          aiAnswer = await processAIAnalysis(ai, responseData, model, key);
        } catch (error) {
          aiAnswer = "AI analizi başarısız oldu: " + (error instanceof Error ? error.message : "Bilinmeyen hata");
        }
      }

      const finalResponse: any = {
        success: true,
        data: responseData
      };

      if (ai) {
        finalResponse.ai_answer = aiAnswer;
      }

      res.json(finalResponse);

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
        note: "Tüm extraction yöntemleri başarısız oldu. Video özel olabilir veya YouTube API sınırlamaları vardır."
      });
    }
  });

  // Helper function to upload file to Gemini Files API
  const uploadFileToGemini = async (fileBuffer: ArrayBuffer, uploadFileName: string, mimeType: string, apiKey: string): Promise<string> => {
    // Step 1: Start resumable upload
    const uploadStartResponse = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': fileBuffer.byteLength.toString(),
        'X-Goog-Upload-Header-Content-Type': mimeType,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: {
          display_name: uploadFileName
        }
      })
    });

    if (!uploadStartResponse.ok) {
      throw new Error(`Failed to start upload: ${uploadStartResponse.status}`);
    }

    const uploadUrl = uploadStartResponse.headers.get('X-Goog-Upload-URL');
    if (!uploadUrl) {
      throw new Error('No upload URL received');
    }

    // Step 2: Upload the file data
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Length': fileBuffer.byteLength.toString(),
        'X-Goog-Upload-Offset': '0',
        'X-Goog-Upload-Command': 'upload, finalize',
      },
      body: fileBuffer
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.status}`);
    }

    const uploadResult = await uploadResponse.json();
    const fileUri = uploadResult.file.uri;
    const extractedFileName = fileUri.split('/').pop();

    // Step 3: Wait for file to become ACTIVE
    await waitForFileActive(extractedFileName, apiKey);
    
    return fileUri;
  };

  // Helper function to wait for file to become ACTIVE
  const waitForFileActive = async (checkFileName: string, apiKey: string, maxAttempts: number = 30): Promise<void> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const checkResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/files/${checkFileName}?key=${apiKey}`, {
        method: 'GET'
      });

      if (!checkResponse.ok) {
        throw new Error(`Failed to check file status: ${checkResponse.status}`);
      }

      const fileStatus = await checkResponse.json();
      
      if (fileStatus.state === 'ACTIVE') {
        return; // File is ready to use
      }
      
      if (fileStatus.state === 'FAILED') {
        throw new Error(`File processing failed: ${fileStatus.error?.message || 'Unknown error'}`);
      }

      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('File did not become ACTIVE within timeout period');
  };

  // Helper function to delete file from Gemini Files API
  const deleteFileFromGemini = async (fileUri: string, apiKey: string): Promise<void> => {
    const fileName = fileUri.split('/').pop();
    const deleteUrl = `https://generativelanguage.googleapis.com/v1beta/files/${fileName}?key=${apiKey}`;

    await fetch(deleteUrl, {
      method: 'DELETE'
    });
    // We don't throw error if delete fails - it's cleanup
  };

  // Video Understanding API Endpoint
  app.get("/api/ai/video", async (req, res) => {
    try {
      const validation = videoRequestSchema.safeParse(req.query);
      if (!validation.success) {
        await storage.logApiUsage({
          endpoint: "/api/ai/video",
          apiKey: null,
          success: false,
          errorMessage: "Invalid request parameters"
        });
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { link, prompt, model, key } = validation.data;
      const geminiApiKey = getGeminiApiKey(key);

      if (!geminiApiKey) {
        await storage.logApiUsage({
          endpoint: "/api/ai/video",
          apiKey: key || null,
          success: false,
          errorMessage: "No Gemini API key available"
        });
        return res.status(500).json({
          success: false,
          error: "No Gemini API key available"
        });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
      let parts: any[] = [{ text: prompt }];
      let uploadedFileUri: string | null = null;

      try {
        // Check if it's a YouTube URL
        const youtubeMatch = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);

        if (youtubeMatch) {
          // For YouTube URLs, use the URL directly
          parts.push({
            file_data: {
              file_uri: link
            }
          });
        } else {
          // For non-YouTube URLs, download and upload to Gemini Files API
          const videoResponse = await fetch(link);
          if (!videoResponse.ok) {
            throw new Error(`Failed to download video: ${videoResponse.status}`);
          }

          const videoBuffer = await videoResponse.arrayBuffer();
          const contentType = videoResponse.headers.get('content-type') || 'video/mp4';

          // Check file size (reasonable limit for upload)
          if (videoBuffer.byteLength > 100 * 1024 * 1024) { // 100MB limit
            throw new Error('Video file too large. Maximum size is 100MB.');
          }

          // Generate a unique filename
          const fileName = `video_${Date.now()}.${contentType.split('/')[1] || 'mp4'}`;

          // Upload to Gemini Files API
          uploadedFileUri = await uploadFileToGemini(videoBuffer, fileName, contentType, geminiApiKey);

          parts.push({
            file_data: {
              file_uri: uploadedFileUri
            }
          });
        }

        const requestBody = {
          contents: [{ parts }]
        };

        const geminiResponse = await makeGeminiRequest(url, requestBody, geminiApiKey);

        const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "Video analizi başarısız oldu";
        const usage = geminiResponse.usageMetadata || {};

        // Cleanup: Delete uploaded file if it exists
        if (uploadedFileUri) {
          try {
            await deleteFileFromGemini(uploadedFileUri, geminiApiKey);
          } catch (cleanupError) {
            console.warn('Failed to cleanup uploaded file:', cleanupError);
          }
        }

        await storage.logApiUsage({
          endpoint: "/api/ai/video",
          apiKey: key || null,
          success: true,
          errorMessage: null
        });

        res.json({
          success: true,
          data: {
            response: responseText,
            video_url: link,
            prompt: prompt,
            model,
            is_youtube: !!youtubeMatch,
            processing_method: youtubeMatch ? "direct_youtube" : "file_upload",
            usage: {
              input_tokens: usage.promptTokenCount || 0,
              output_tokens: usage.candidatesTokenCount || 0
            }
          }
        });

      } catch (processingError) {
        // Cleanup: Delete uploaded file if it exists and there was an error
        if (uploadedFileUri) {
          try {
            await deleteFileFromGemini(uploadedFileUri, geminiApiKey);
          } catch (cleanupError) {
            console.warn('Failed to cleanup uploaded file after error:', cleanupError);
          }
        }
        throw processingError;
      }

    } catch (error) {
      await storage.logApiUsage({
        endpoint: "/api/ai/video",
        apiKey: req.query.key as string || null,
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error"
      });

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // YouTube Channel API Endpoint (Enhanced)
  app.get("/api/ytch", async (req, res) => {
    try {
      const validation = ytChannelRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { link, ai, model, key } = validation.data;

      // Extract channel identifier from URL
      const channelMatch = link.match(/(?:youtube\.com\/(?:channel\/|c\/|user\/|@))([^\/\?]+)/);
      if (!channelMatch) {
        return res.status(400).json({
          success: false,
          error: "Invalid YouTube channel URL"
        });
      }

      const channelIdentifier = channelMatch[1];

      try {
        const response = await fetch(link);
        if (!response.ok) {
          throw new Error(`Failed to fetch channel page: ${response.status}`);
        }

        const html = await response.text();

        // Extract channel info from HTML
        const nameMatch = html.match(/"title":"([^"]+)"/);
        const avatarMatch = html.match(/"avatar":\{"thumbnails":\[{"url":"([^"]+)"/);
        const descMatch = html.match(/"description":"([^"]+)"/);
        const bannerMatch = html.match(/"banner":\{"thumbnails":\[{"url":"([^"]+)"/);
        const subscriberMatch = html.match(/"subscriberCountText":\{"simpleText":"([^"]+)"/);

        const responseData = {
          id: channelIdentifier,
          name: nameMatch ? nameMatch[1] : "Kanal adı bulunamadı",
          url: link,
          avatar: avatarMatch ? avatarMatch[1] : null,
          description: descMatch ? descMatch[1].replace(/\\n/g, '\n') : "Açıklama bulunamadı",
          banner: bannerMatch ? bannerMatch[1] : null,
          subscriber_count: subscriberMatch ? subscriberMatch[1] : "Abone sayısı bulunamadı"
        };

        // Process AI analysis if requested
        let aiAnswer = null;
        if (ai) {
          try {
            aiAnswer = await processAIAnalysis(ai, responseData, model, key);
          } catch (error) {
            aiAnswer = "AI analizi başarısız oldu: " + (error instanceof Error ? error.message : "Bilinmeyen hata");
          }
        }

        const finalResponse: any = {
          success: true,
          data: responseData
        };

        if (ai) {
          finalResponse.ai_answer = aiAnswer;
        }

        res.json(finalResponse);

      } catch (error) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Failed to fetch channel information"
        });
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Weather API Endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const validation = weatherRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { place, ai, model, key } = validation.data;

      // Use free weather service (wttr.in) - no API key required
      try {
        // Use wttr.in which provides free weather data
        const weatherUrl = `https://wttr.in/${encodeURIComponent(place)}?format=j1`;
        const weatherResponse = await fetch(weatherUrl, {
          headers: {
            'User-Agent': 'Entegar-API/1.0'
          }
        });

        if (!weatherResponse.ok) {
          throw new Error(`Weather API error: ${weatherResponse.status}`);
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current_condition || weatherData.current_condition.length === 0) {
          return res.status(404).json({
            success: false,
            error: "Weather data not found for this location"
          });
        }

        const current = weatherData.current_condition[0];
        const area = weatherData.nearest_area && weatherData.nearest_area[0];

        const responseData = {
          location: {
            name: area?.areaName?.[0]?.value || place,
            country: area?.country?.[0]?.value || "Unknown",
            state: area?.region?.[0]?.value || null,
            coordinates: {
              lat: parseFloat(area?.latitude || "0"),
              lon: parseFloat(area?.longitude || "0")
            }
          },
          weather: {
            temperature: parseFloat(current.temp_C),
            feels_like: parseFloat(current.FeelsLikeC),
            humidity: parseInt(current.humidity),
            pressure: parseInt(current.pressure),
            description: current.weatherDesc?.[0]?.value || "Unknown",
            wind_speed: parseFloat(current.windspeedKmph) / 3.6, // Convert km/h to m/s
            wind_direction: parseInt(current.winddirDegree),
            visibility: parseFloat(current.visibility),
            clouds: parseInt(current.cloudcover),
            uv_index: parseFloat(current.uvIndex || "0")
          },
          timestamp: new Date().toISOString()
        };

        // Process AI analysis if requested
        let aiAnswer = null;
        if (ai) {
          try {
            aiAnswer = await processAIAnalysis(ai, responseData, model, key);
          } catch (error) {
            aiAnswer = "AI analizi başarısız oldu: " + (error instanceof Error ? error.message : "Bilinmeyen hata");
          }
        }

        const finalResponse: any = {
          success: true,
          data: responseData
        };

        if (ai) {
          finalResponse.ai_answer = aiAnswer;
        }

        await storage.logApiUsage({
          endpoint: "/api/weather",
          apiKey: key || null,
          success: true,
          errorMessage: null
        });

        res.json(finalResponse);

      } catch (error) {
        await storage.logApiUsage({
          endpoint: "/api/weather",
          apiKey: key || null,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });

        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Failed to fetch weather data"
        });
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Image Generation API Endpoint
  app.get("/api/i/:prompt", async (req, res) => {
    try {
      // Get prompt from URL path
      const prompt = decodeURIComponent(req.params.prompt);
      const { type = "gemini", model = "gemini-2.0-flash-preview-image-generation", key } = req.query;

      const validation = imageGenerationRequestSchema.safeParse({
        prompt,
        type,
        model,
        key
      });

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const geminiApiKey = getGeminiApiKey(key as string);

      if (!geminiApiKey) {
        await storage.logApiUsage({
          endpoint: "/api/i",
          apiKey: key as string || null,
          success: false,
          errorMessage: "No Gemini API key available"
        });
        return res.status(500).json({
          success: false,
          error: "No Gemini API key available for image generation"
        });
      }

      try {
        let url: string;
        let requestBody: any;

        if (type === "gemini") {
          // Use Gemini image generation with correct API endpoint
          url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
          requestBody = {
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"]
            }
          };
        } else {
          // Use Imagen 3 with correct API endpoint
          url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiApiKey}`;
          requestBody = {
            instances: [{
              prompt: prompt
            }],
            parameters: {
              sampleCount: 1
            }
          };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        let imageData = null;
        let textResponse = null;

        if (type === "gemini") {
          // Handle Gemini response format
          const candidate = data.candidates?.[0];
          if (!candidate?.content?.parts) {
            throw new Error("No image generated in response");
          }

          for (const part of candidate.content.parts) {
            if (part.inlineData?.data) {
              imageData = part.inlineData.data;
            }
            if (part.text) {
              textResponse = part.text;
            }
          }
        } else {
          // Handle Imagen response format
          if (data.predictions && data.predictions.length > 0) {
            const prediction = data.predictions[0];
            imageData = prediction.bytesBase64Encoded;
          }
        }

        if (!imageData) {
          throw new Error("No image data found in response");
        }

        // Save image file to local storage
        const fs = await import('fs/promises');
        const path = await import('path');
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(process.cwd(), 'temp');
        try {
          await fs.mkdir(tempDir, { recursive: true });
        } catch (error) {
          // Directory already exists
        }

        // Generate unique filename
        const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2)}.png`;
        const filePath = path.join(tempDir, fileName);
        
        // Convert base64 to buffer and save
        const imageBuffer = Buffer.from(imageData, 'base64');
        await fs.writeFile(filePath, imageBuffer);

        // Create public URL
        const imageUrl = `/temp/${fileName}`;

        // Schedule file deletion after 5 minutes
        setTimeout(async () => {
          try {
            await fs.unlink(filePath);
            console.log(`Deleted image file: ${fileName}`);
          } catch (error) {
            console.warn(`Failed to delete image file ${fileName}:`, error);
          }
        }, 5 * 60 * 1000); // 5 minutes

        await storage.logApiUsage({
          endpoint: "/api/i",
          apiKey: key as string || null,
          success: true,
          errorMessage: null
        });

        res.json({
          success: true,
          data: {
            prompt,
            type,
            model,
            image_url: imageUrl,
            image_data_url: `data:image/png;base64,${imageData}`,
            image_data: imageData,
            text_response: textResponse,
            format: "both",
            expires_in: "5 minutes"
          }
        });

      } catch (error) {
        await storage.logApiUsage({
          endpoint: "/api/i",
          apiKey: key as string || null,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });

        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Image generation failed"
        });
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Alternative route for query parameter format
  app.get("/api/i", async (req, res) => {
    try {
      const validation = imageGenerationRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { prompt, type, model, key } = validation.data;
      const geminiApiKey = getGeminiApiKey(key);

      if (!geminiApiKey) {
        await storage.logApiUsage({
          endpoint: "/api/i",
          apiKey: key || null,
          success: false,
          errorMessage: "No Gemini API key available"
        });
        return res.status(500).json({
          success: false,
          error: "No Gemini API key available for image generation"
        });
      }

      try {
        let url: string;
        let requestBody: any;

        if (type === "gemini") {
          // Use Gemini image generation with correct API endpoint
          url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
          requestBody = {
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"]
            }
          };
        } else {
          // Use Imagen 3 with correct API endpoint
          url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiApiKey}`;
          requestBody = {
            instances: [{
              prompt: prompt
            }],
            parameters: {
              sampleCount: 1
            }
          };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        let imageData = null;
        let textResponse = null;

        if (type === "gemini") {
          // Handle Gemini response format
          const candidate = data.candidates?.[0];
          if (!candidate?.content?.parts) {
            throw new Error("No image generated in response");
          }

          for (const part of candidate.content.parts) {
            if (part.inlineData?.data) {
              imageData = part.inlineData.data;
            }
            if (part.text) {
              textResponse = part.text;
            }
          }
        } else {
          // Handle Imagen response format
          if (data.predictions && data.predictions.length > 0) {
            const prediction = data.predictions[0];
            imageData = prediction.bytesBase64Encoded;
          }
        }

        if (!imageData) {
          throw new Error("No image data found in response");
        }

        // Save image file to local storage
        const fs = await import('fs/promises');
        const path = await import('path');
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(process.cwd(), 'temp');
        try {
          await fs.mkdir(tempDir, { recursive: true });
        } catch (error) {
          // Directory already exists
        }

        // Generate unique filename
        const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2)}.png`;
        const filePath = path.join(tempDir, fileName);
        
        // Convert base64 to buffer and save
        const imageBuffer = Buffer.from(imageData, 'base64');
        await fs.writeFile(filePath, imageBuffer);

        // Create public URL
        const imageUrl = `/temp/${fileName}`;

        // Schedule file deletion after 5 minutes
        setTimeout(async () => {
          try {
            await fs.unlink(filePath);
            console.log(`Deleted image file: ${fileName}`);
          } catch (error) {
            console.warn(`Failed to delete image file ${fileName}:`, error);
          }
        }, 5 * 60 * 1000); // 5 minutes

        await storage.logApiUsage({
          endpoint: "/api/i",
          apiKey: key || null,
          success: true,
          errorMessage: null
        });

        res.json({
          success: true,
          data: {
            prompt,
            type,
            model,
            image_url: imageUrl,
            image_data_url: `data:image/png;base64,${imageData}`,
            image_data: imageData,
            text_response: textResponse,
            format: "both",
            expires_in: "5 minutes"
          }
        });

      } catch (error) {
        await storage.logApiUsage({
          endpoint: "/api/i",
          apiKey: key || null,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });

        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Image generation failed"
        });
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // IP Check API Endpoint
  app.get("/api/ipcheck", async (req, res) => {
    try {
      const validation = ipCheckRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { ip } = validation.data;

      try {
        // If no IP provided, get client's IP automatically
        const targetIp = ip || req.ip || req.connection.remoteAddress || '';

        // Use ip-api.com for IP geolocation (free, no API key required)
        const ipApiUrl = `http://ip-api.com/json/${targetIp}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`;
        const response = await fetch(ipApiUrl);

        if (!response.ok) {
          throw new Error(`IP API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'fail') {
          return res.status(400).json({
            success: false,
            error: data.message || "Invalid IP address"
          });
        }

        // Note: Browser, OS, Processor, Screen info cannot be determined from IP alone
        // These require client-side detection and would need to be sent by the client
        const responseData = {
          ip: data.query,
          country: data.country,
          country_code: data.countryCode,
          state: data.regionName,
          city: data.city,
          postal_code: data.zip,
          isp: data.isp,
          organization: data.org,
          as_number: data.as,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
          // Client-side info would need to be provided separately
          os: "Unknown (requires client detection)",
          processor: "Unknown (requires client detection)", 
          browser: "Unknown (requires client detection)",
          screen: "Unknown (requires client detection)"
        };

        await storage.logApiUsage({
          endpoint: "/api/ipcheck",
          apiKey: null,
          success: true,
          errorMessage: null
        });

        res.json({
          success: true,
          data: responseData
        });

      } catch (error) {
        await storage.logApiUsage({
          endpoint: "/api/ipcheck",
          apiKey: null,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });

        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Failed to fetch IP information"
        });
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Content Moderation API Endpoint (Enhanced with Image Support)
  app.get("/api/check", async (req, res) => {
    try {
      // Check if this is an image checking request
      const imageValidation = imageCheckRequestSchema.safeParse(req.query);
      
      if (imageValidation.success) {
        // Handle image checking
        const { i: imageUrl, type, prompt, model, key } = imageValidation.data;
        const geminiApiKey = getGeminiApiKey(key);

        if (!geminiApiKey) {
          await storage.logApiUsage({
            endpoint: "/api/check",
            apiKey: key || null,
            success: false,
            errorMessage: "No Gemini API key available"
          });
          return res.status(500).json({
            success: false,
            error: "No Gemini API key available for image moderation"
          });
        }

        try {
          let systemPrompt = "Sen bir içerik moderasyon uzmanısın. ";

          if (type === "yuzdeli") {
            systemPrompt += "İçeriğin uygunluğunu 0-100 arası yüzde olarak değerlendir. ";
          } else {
            systemPrompt += "İçeriğin uygun olup olmadığını true/false olarak değerlendir. ";
          }

          if (prompt) {
            systemPrompt += `Özel kurallar: ${prompt}. `;
          } else {
            systemPrompt += "Genel kurallar: Çıplaklık, şiddet, nefret söylemi, çocuklara zarar verici içerik kontrol et. ";
          }

          if (type === "yuzdeli") {
            systemPrompt += `Yanıtını şu JSON formatında ver: {"status": "%XX", "comment": "açıklama"}`;
          } else {
            systemPrompt += `Yanıtını şu JSON formatında ver: {"status": true/false, "comment": "açıklama"}`;
          }

          // Download and process image
          const imageResponse = await fetch(imageUrl);
          if (!imageResponse.ok) {
            throw new Error(`Failed to download image: ${imageResponse.status}`);
          }

          const imageBuffer = await imageResponse.arrayBuffer();
          const imageBase64 = Buffer.from(imageBuffer).toString('base64');
          const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
          const requestBody = {
            contents: [{
              parts: [
                { text: "Bu görüntüyü analiz et ve uygunluğunu değerlendir." },
                {
                  inline_data: {
                    mime_type: contentType,
                    data: imageBase64
                  }
                }
              ]
            }],
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            }
          };

          const geminiResponse = await makeGeminiRequest(url, requestBody, geminiApiKey);
          const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

          // Parse JSON response
          let moderationResult;
          try {
            const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
            const jsonText = jsonMatch ? jsonMatch[1] : responseText;
            moderationResult = JSON.parse(jsonText);
          } catch (parseError) {
            try {
              if (type === "yuzdeli") {
                const percentMatch = responseText.match(/["%](\d+)["%]/);
                moderationResult = {
                  status: percentMatch ? `%${percentMatch[1]}` : "%50",
                  comment: responseText
                };
              } else {
                const boolMatch = responseText.toLowerCase().includes('true') || 
                                responseText.toLowerCase().includes('uygun');
                moderationResult = {
                  status: boolMatch,
                  comment: responseText
                };
              }
            } catch {
              moderationResult = {
                status: type === "yuzdeli" ? "%50" : false,
                comment: responseText
              };
            }
          }

          await storage.logApiUsage({
            endpoint: "/api/check",
            apiKey: key || null,
            success: true,
            errorMessage: null
          });

          return res.json({
            success: true,
            data: {
              type: type,
              content_type: "image",
              content: imageUrl,
              moderation: moderationResult,
              model: model
            }
          });

        } catch (error) {
          await storage.logApiUsage({
            endpoint: "/api/check",
            apiKey: key || null,
            success: false,
            errorMessage: error instanceof Error ? error.message : "Unknown error"
          });

          return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Image moderation failed"
          });
        }
      }

      // Fall back to existing content check validation
      const validation = contentCheckRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { q, v, type, prompt, model, key } = validation.data;
      const geminiApiKey = getGeminiApiKey(key);

      if (!geminiApiKey) {
        await storage.logApiUsage({
          endpoint: "/api/check",
          apiKey: key || null,
          success: false,
          errorMessage: "No Gemini API key available"
        });
        return res.status(500).json({
          success: false,
          error: "No Gemini API key available for content moderation"
        });
      }

      try {
        let systemPrompt = "Sen bir içerik moderasyon uzmanısın. Verilen içeriğin sosyal medya ve diğer platformlarda yayınlanmasının uygun olup olmadığını değerlendiriyorsun. İçeriği kontrol ediyorsun.";

        if (type === "yuzdeli") {
          systemPrompt += "İçeriğin uygunluğunu 0-100 arası yüzde olarak değerlendir. ";
        } else {
          systemPrompt += "İçeriğin uygun olup olmadığını true/false olarak değerlendir. ";
        }

        if (prompt) {
          systemPrompt += `Özel kurallar: ${prompt}. `;
        } else {
          systemPrompt += "Genel kurallar: Çıplaklık, şiddet, nefret söylemi, çocuklara zarar verici içerik kontrol et. ";
        }

        if (type === "yuzdeli") {
          systemPrompt += `Yanıtını şu JSON formatında ver: {"status": "%XX", "comment": "açıklama"} Ama '''Json gibi başına ve sonuna prefixler ekleme. Dümdüz JSON'u yaz. Markdownları sakın yazma.`;
        } else {
          systemPrompt += `Yanıtını şu JSON formatında ver: {"status": true/false, "comment": "açıklama"} Ama '''Json gibi başına ve sonuna prefixler ekleme. Dümdüz JSON'u yaz. Markdownları sakın yazma.`;
        }

        let userPrompt = "";
        let parts: any[] = [];

        if (q) {
          // Text content check
          userPrompt = `Bu metin uygun mu? "${q}"`;
          parts = [{ text: systemPrompt + "\n\n" + userPrompt }];
        } else if (v) {
          // Video content check
          userPrompt = "Bu video uygun mu?";
          let uploadedFileUri: string | null = null;

          try {
            // Check if it's a YouTube URL
            const youtubeMatch = v.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);

            if (youtubeMatch) {
              // For YouTube URLs, use the URL directly
              parts = [
                { text: systemPrompt + "\n\n" + userPrompt },
                {
                  file_data: {
                    file_uri: v
                  }
                }
              ];
            } else {
              // For non-YouTube URLs, use file upload approach
              try {
                const videoResponse = await fetch(v);
                if (!videoResponse.ok) {
                  throw new Error(`Failed to download video: ${videoResponse.status}`);
                }

                const videoBuffer = await videoResponse.arrayBuffer();
                const contentType = videoResponse.headers.get('content-type') || 'video/mp4';

                // Check file size (reasonable limit)
                if (videoBuffer.byteLength > 100 * 1024 * 1024) { // 100MB limit
                  throw new Error('Video file too large for content moderation');
                }

                // Generate a unique filename
                const fileName = `check_video_${Date.now()}.${contentType.split('/')[1] || 'mp4'}`;

                // Upload to Gemini Files API
                uploadedFileUri = await uploadFileToGemini(videoBuffer, fileName, contentType, geminiApiKey);

                parts = [
                  { text: systemPrompt + "\n\n" + userPrompt },
                  {
                    file_data: {
                      file_uri: uploadedFileUri
                    }
                  }
                ];

              } catch (downloadError) {
                // Fallback to text-based analysis if upload fails
                parts = [
                  { text: systemPrompt + "\n\nVideo URL analizi: " + v + "\n\nBu video URL'inin içeriği uygun mu? Video dosya adından, URL'den ve erişebildiğin bilgilerden değerlendirme yap." }
                ];
              }
            }

            // Store uploadedFileUri for later cleanup
            if (uploadedFileUri) {
              // We'll clean it up after the API call
              parts.push({ text: `__CLEANUP_FILE_URI__${uploadedFileUri}` });
            }

          } catch (error) {
            // Fallback to text analysis
            parts = [
              { text: systemPrompt + "\n\nVideo URL analizi: " + v + "\n\nBu video URL'inin içeriği uygun mu? Video dosya adından, URL'den ve erişebildiğin bilgilerden değerlendirme yap." }
            ];
          }
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
        const requestBody = {
          contents: [{ parts }]
        };

        // Extract cleanup info before making the request
        let cleanupFileUri: string | null = null;
        const cleanupPart = parts.find(part => part.text && part.text.includes('__CLEANUP_FILE_URI__'));
        if (cleanupPart) {
          cleanupFileUri = cleanupPart.text.replace('__CLEANUP_FILE_URI__', '');
          // Remove the cleanup marker from parts
          parts = parts.filter(part => !part.text || !part.text.includes('__CLEANUP_FILE_URI__'));
        }

        const geminiResponse = await makeGeminiRequest(url, requestBody, geminiApiKey);
        const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        // Cleanup uploaded file if exists
        if (cleanupFileUri) {
          try {
            await deleteFileFromGemini(cleanupFileUri, geminiApiKey);
          } catch (cleanupError) {
            console.warn('Failed to cleanup uploaded file:', cleanupError);
          }
        }

        // Try to parse JSON response
        let moderationResult;
        try {
          // Extract JSON from markdown code blocks if present
          const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
          const jsonText = jsonMatch ? jsonMatch[1] : responseText;
          moderationResult = JSON.parse(jsonText);
        } catch (parseError) {
          // If JSON parsing fails, try to extract values from the text
          try {
            if (type === "yuzdeli") {
              const percentMatch = responseText.match(/["%](\d+)["%]/);
              moderationResult = {
                status: percentMatch ? `%${percentMatch[1]}` : "%50",
                comment: responseText
              };
            } else {
              const boolMatch = responseText.toLowerCase().includes('true') || 
                              responseText.toLowerCase().includes('uygun');
              moderationResult = {
                status: boolMatch,
                comment: responseText
              };
            }
          } catch {
            moderationResult = {
              status: type === "yuzdeli" ? "%50" : false,
              comment: responseText
            };
          }
        }

        await storage.logApiUsage({
          endpoint: "/api/check",
          apiKey: key || null,
          success: true,
          errorMessage: null
        });

        res.json({
          success: true,
          data: {
            type: type,
            content_type: q ? "text" : "video",
            content: q || v,
            moderation: moderationResult,
            model: model
          }
        });

      } catch (error) {
        await storage.logApiUsage({
          endpoint: "/api/check",
          apiKey: key || null,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });

        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Content moderation failed"
        });
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });

  // Auto-Subtitle API Endpoint
  app.get("/api/ai/autosub", async (req, res) => {
    try {
      const validation = autoSubRequestSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid request parameters",
          details: validation.error.errors
        });
      }

      const { myaudiolink, prompt, lang, model, key } = validation.data;
      const geminiApiKey = getGeminiApiKey(key);

      if (!geminiApiKey) {
        await storage.logApiUsage({
          endpoint: "/api/ai/autosub",
          apiKey: key || null,
          success: false,
          errorMessage: "No Gemini API key available"
        });
        return res.status(500).json({
          success: false,
          error: "No Gemini API key available for audio transcription"
        });
      }

      try {
        // Language-specific system and user prompts
        let systemPrompt;
        let userPrompt;

        if (lang === "tr") {
          systemPrompt = `Sen altyazı çıkaran bir botsun ve formatın sadece "00:01 ; Neler oluyor?" şeklinde alt alta yazı üretirsin. Her satırda zaman damgası ve o anda konuşulan şeyi yaz. Dili algıla, ama dil ne olursa olsun bunu Türkçe olarak altyazıya çevir. Mesela 'hello' diyorsa 'merhaba' yazacaksın. Konuşulan şey yoksa, mesela sadece enstrümental bir müzik ise, *müzik* yazacaksın. Veya kuş sesi varsa *kuş sesleri* şeklinde yazacaksın. Sadece altyazıyı çıkar, ek açıklama yapma.`;
          userPrompt = `Bu ses dosyasını alt alta zaman damgalarını yazarak Türkçe altyazı çıkar. Hangi dilde konuşulursa konuşulsun, altyazıyı Türkçeye çevir. Format "saat:dakika:saniye ; O saniyelerde Türkçe konuşulan şey..."`;
        } else if (lang === "en") {
          systemPrompt = `You are a subtitle generator bot and your format is "00:01 ; What's happening?" line by line with timestamps. Write each line with timestamp and what is being said at that moment. Detect the language, but no matter what language it is, translate it to English subtitles. For example, if someone says 'merhaba', you will write 'hello'. If there's no speech, like just instrumental music, write *music*. Or if there are bird sounds, write *bird sounds*. Write subtitles in English, no matter what the language. Translate to English. Only extract subtitles, no additional explanations.`;
          userPrompt = `Extract timestamped English subtitles from this audio file line by line. No matter what language is spoken, translate the subtitles to English. Format "hour:minute:second ; What is being said in English at that moment..."`;
        } else {
          // Default Turkish behavior when no lang parameter
          systemPrompt = `Sen altyazı çıkaran bir botsun ve formatın sadece "00:01 ; Neler oluyor?" şeklinde alt alta yazı üretirsin. Her satırda zaman damgası ve o anda konuşulan şeyi yaz. Konuşulan şey yoksa, mesela sadece enstrümental bir müzik ise, *müzik* yazacaksın. Veya kuş sesi varsa *kuş sesleri* şeklinde yazacaksın. Veya sıfır ses varsa *sessizlik* yazacaksın. Hapşırma varsa *hapşu* yazacaksın örneğin. Sana verilen şey bir konuşma veya müzik olabilir. Sadece altyazıyı çıkar, ek açıklama yapma.`;
          userPrompt = `Bu ses dosyasını alt alta zaman damgalarını yazarak alt alta transkriptini çıkar. Format "saat:dakika:saniye ; O saniyelerde Konuşulan şey..."`;
        }

        // If custom prompt is provided, use it instead (overrides language-specific prompts)
        if (prompt) {
          userPrompt = prompt;
        }

        // Use file upload approach for audio processing with format conversion
        const audioResponse = await fetch(myaudiolink);
        if (!audioResponse.ok) {
          throw new Error(`Failed to download audio: ${audioResponse.status}`);
        }

        const audioBuffer = await audioResponse.arrayBuffer();
        let contentType = audioResponse.headers.get('content-type') || 'audio/mpeg';

        // Validate file size (reasonable limit for upload)
        if (audioBuffer.byteLength > 100 * 1024 * 1024) { // 100MB limit
          throw new Error('Audio file too large. Maximum size is 100MB.');
        }

        // Convert audio to MP3 if it's not already in a supported format
        let processedBuffer = audioBuffer;
        const supportedFormats = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/aiff', 'audio/aac', 'audio/ogg', 'audio/flac'];
        
        if (!supportedFormats.includes(contentType)) {
          // For video files or unsupported formats, convert to MP3 using FFmpeg
          const tempInputFile = `/tmp/input_${Date.now()}`;
          const tempOutputFile = `/tmp/output_${Date.now()}.mp3`;
          
          try {
            // Write input file
            const fs = await import('fs/promises');
            await fs.writeFile(tempInputFile, Buffer.from(audioBuffer));
            
            // Convert to MP3 using FFmpeg
            const { spawn } = await import('child_process');
            await new Promise((resolve, reject) => {
              const ffmpeg = spawn('ffmpeg', [
                '-i', tempInputFile,
                '-vn', // No video
                '-acodec', 'mp3',
                '-ab', '128k',
                '-ar', '44100',
                '-y', // Overwrite output file
                tempOutputFile
              ]);
              
              ffmpeg.on('close', (code) => {
                if (code === 0) resolve(null);
                else reject(new Error(`FFmpeg conversion failed with code ${code}`));
              });
            });
            
            // Read converted file
            const convertedBuffer = await fs.readFile(tempOutputFile);
            processedBuffer = convertedBuffer.buffer;
            contentType = 'audio/mpeg';
            
            // Cleanup temp files
            await fs.unlink(tempInputFile).catch(() => {});
            await fs.unlink(tempOutputFile).catch(() => {});
            
          } catch (conversionError) {
            throw new Error(`Audio conversion failed: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`);
          }
        }

        // Generate a unique filename
        const fileName = `audio_${Date.now()}.mp3`;

        // Upload to Gemini Files API
        const uploadedFileUri = await uploadFileToGemini(processedBuffer, fileName, 'audio/mpeg', geminiApiKey);

        let transcript = "Transkripsiyon başarısız oldu";
        let usage: any = {};
        
        try {
          // Use file_data for audio transcription
          const transcriptionUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
          const requestBody = {
            contents: [{
              parts: [
                { text: userPrompt },
                {
                  file_data: {
                    file_uri: uploadedFileUri
                  }
                }
              ]
            }],
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            }
          };

          const transcriptionData = await makeGeminiRequest(transcriptionUrl, requestBody, geminiApiKey);
          transcript = transcriptionData.candidates?.[0]?.content?.parts?.[0]?.text || "Transkripsiyon başarısız oldu";
          usage = transcriptionData.usageMetadata || {};

        } finally {
          // Always cleanup the uploaded file
          try {
            await deleteFileFromGemini(uploadedFileUri, geminiApiKey);
          } catch (cleanupError) {
            console.warn('Failed to cleanup uploaded audio file:', cleanupError);
          }
        }

        await storage.logApiUsage({
          endpoint: "/api/ai/autosub",
          apiKey: key || null,
          success: true,
          errorMessage: null
        });

        res.json({
          success: true,
          data: {
            audio_url: myaudiolink,
            transcript: transcript,
            format: "timestamped",
            language: lang || "auto",
            custom_prompt: !!prompt,
            prompt_used: prompt || userPrompt,
            model: model,
            processing_method: "file_upload",
            usage: {
              input_tokens: (usage as any).promptTokenCount || 0,
              output_tokens: (usage as any).candidatesTokenCount || 0
            }
          }
        });

      } catch (error) {
        await storage.logApiUsage({
          endpoint: "/api/ai/autosub",
          apiKey: key || null,
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });

        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : "Audio transcription failed"
        });
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      });
    }
  });



  // Statistics API Endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch statistics"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}