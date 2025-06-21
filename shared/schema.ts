import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const apiUsage = pgTable("api_usage", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull(),
  apiKey: text("api_key"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  success: boolean("success").notNull().default(true),
  errorMessage: text("error_message"),
});

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  key: true,
  name: true,
  isActive: true,
});

export const insertApiUsageSchema = createInsertSchema(apiUsage).pick({
  endpoint: true,
  apiKey: true,
  success: true,
  errorMessage: true,
}).partial();

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiUsage = z.infer<typeof insertApiUsageSchema>;
export type ApiUsage = typeof apiUsage.$inferSelect;

// API Request/Response schemas
export const aiRequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
  image: z.string().url().optional(),
  video: z.string().url().optional(),
  model: z.string().default("gemini-2.5-flash"),
  system: z.string().optional(),
  key: z.string().optional(),
}).refine(data => !(data.image && data.video), {
  message: "Cannot use both image and video parameters together"
});

export const ttsRequestSchema = z.object({
  query: z.string().optional(),
  ai: z.string().optional(),
  name: z.string().default("tr-TR-AhmetNeural"),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
}).refine(data => data.query || data.ai, {
  message: "Either query or ai parameter is required"
}).refine(data => !(data.query && data.ai), {
  message: "Cannot use both query and ai parameters together"
}).refine(data => !(data.query && data.model !== "gemini-2.5-flash"), {
  message: "Model parameter cannot be used with query parameter"
});

export const wikiRequestSchema = z.object({
  q: z.string().min(1, "Query is required"),
  type: z.enum(["wikipedia", "wikiquote"]).default("wikipedia"),
  lang: z.string().default("tr"),
  ai: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const tdkRequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
  ai: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const ytRequestSchema = z.object({
  link: z.string().url("Valid YouTube URL is required"),
  ai: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const urlContextRequestSchema = z.object({
  q: z.string().min(1, "Query is required"),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const translateRequestSchema = z.object({
  q: z.string().min(1, "Query is required"),
  to: z.string().min(1, "Target language is required"),
  key: z.string().optional(),
});

export const ytChannelRequestSchema = z.object({
  link: z.string().url("Valid YouTube channel URL is required"),
  ai: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const movieRequestSchema = z.object({
  q: z.string().min(1, "Movie name is required"),
  ai: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const currencyRequestSchema = z.object({
  q: z.string().min(1, "Currency code is required"),
  to: z.string().min(1, "Target currency is required"),
  ai: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const earthquakeLatestRequestSchema = z.object({
  country: z.string().min(1, "Country is required"),
  ai: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const earthquakeLastRequestSchema = z.object({
  country: z.string().min(1, "Country is required"),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  ai: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const videoRequestSchema = z.object({
  link: z.string().url("Valid video URL is required"),
  prompt: z.string().min(1, "Prompt is required"),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const weatherRequestSchema = z.object({
  place: z.string().min(1, "Place is required"),
  ai: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const imageGenerationRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  type: z.enum(["gemini", "imagen"]).default("gemini"),
  model: z.string().default("gemini-2.0-flash-preview-image-generation"),
  key: z.string().optional(),
});

export const ipCheckRequestSchema = z.object({
  ip: z.string().optional().default(""),
});

export const contentCheckRequestSchema = z.object({
  q: z.string().optional(),
  v: z.string().url().optional(),
  type: z.enum(["boolean", "yuzdeli"]).default("boolean"),
  prompt: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
}).refine(data => data.q || data.v, {
  message: "Either q (text) or v (video URL) parameter is required"
}).refine(data => !(data.q && data.v), {
  message: "Cannot use both q and v parameters together"
});

export const autoSubRequestSchema = z.object({
  myaudiolink: z.string().url("Valid audio URL is required"),
  prompt: z.string().optional(),
  lang: z.enum(["tr", "en"]).optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const imageCheckRequestSchema = z.object({
  i: z.string().url("Valid image URL is required"),
  type: z.enum(["boolean", "yuzdeli"]).default("boolean"),
  prompt: z.string().optional(),
  model: z.string().default("gemini-2.5-flash"),
  key: z.string().optional(),
});

export const screenshotRequestSchema = z.object({
  link: z.string().url("Valid website URL is required"),
  key: z.string().optional(),
});

export type AIRequest = z.infer<typeof aiRequestSchema>;
export type TTSRequest = z.infer<typeof ttsRequestSchema>;
export type WikiRequest = z.infer<typeof wikiRequestSchema>;
export type TDKRequest = z.infer<typeof tdkRequestSchema>;
export type YTRequest = z.infer<typeof ytRequestSchema>;
export type UrlContextRequest = z.infer<typeof urlContextRequestSchema>;
export type TranslateRequest = z.infer<typeof translateRequestSchema>;
export type YTChannelRequest = z.infer<typeof ytChannelRequestSchema>;
export type MovieRequest = z.infer<typeof movieRequestSchema>;
export type CurrencyRequest = z.infer<typeof currencyRequestSchema>;
export type EarthquakeLatestRequest = z.infer<typeof earthquakeLatestRequestSchema>;
export type EarthquakeLastRequest = z.infer<typeof earthquakeLastRequestSchema>;
export type VideoRequest = z.infer<typeof videoRequestSchema>;
export type WeatherRequest = z.infer<typeof weatherRequestSchema>;
export type ImageGenerationRequest = z.infer<typeof imageGenerationRequestSchema>;
export type IpCheckRequest = z.infer<typeof ipCheckRequestSchema>;
export type ContentCheckRequest = z.infer<typeof contentCheckRequestSchema>;
export type AutoSubRequest = z.infer<typeof autoSubRequestSchema>;
export type ImageCheckRequest = z.infer<typeof imageCheckRequestSchema>;
export type ScreenshotRequest = z.infer<typeof screenshotRequestSchema>;
