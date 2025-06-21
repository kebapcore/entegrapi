import { apiKeys, apiUsage, type ApiKey, type InsertApiKey, type InsertApiUsage, type ApiUsage } from "@shared/schema";

export interface IStorage {
  // API Key management
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  getApiKey(key: string): Promise<ApiKey | undefined>;
  getAllApiKeys(): Promise<ApiKey[]>;
  
  // Usage tracking
  logApiUsage(usage: InsertApiUsage): Promise<ApiUsage>;
  getApiUsage(limit?: number): Promise<ApiUsage[]>;
  
  // Statistics
  getStatistics(): Promise<{
    requestsPerSecond: number;
    totalRequests: number;
    endpointCount: number;
    dailyRequests: number;
  }>;
}

export class MemStorage implements IStorage {
  private apiKeys: Map<string, ApiKey>;
  private apiUsage: ApiUsage[];
  private currentApiKeyId: number;
  private currentUsageId: number;
  private requestTimestamps: number[];
  private readonly endpoints = [
    '/api/weather', '/api/i', '/api/ipcheck', '/api/check', '/api/ai/autosub'
  ];

  constructor() {
    this.apiKeys = new Map();
    this.apiUsage = [];
    this.currentApiKeyId = 1;
    this.currentUsageId = 1;
    this.requestTimestamps = [];
    
    // Initialize with default system API key
    this.createApiKey({
      key: "system_default_key",
      name: "System Default",
      isActive: true,
    });
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const id = this.currentApiKeyId++;
    const apiKey: ApiKey = {
      id,
      key: insertApiKey.key,
      name: insertApiKey.name,
      isActive: insertApiKey.isActive ?? true,
      createdAt: new Date(),
    };
    this.apiKeys.set(apiKey.key, apiKey);
    return apiKey;
  }

  async getApiKey(key: string): Promise<ApiKey | undefined> {
    return this.apiKeys.get(key);
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values());
  }

  async logApiUsage(insertUsage: InsertApiUsage): Promise<ApiUsage> {
    const id = this.currentUsageId++;
    const now = Date.now();
    
    // Track request timestamp for statistics
    this.requestTimestamps.push(now);
    
    // Keep only last 60 seconds of timestamps for RPS calculation
    const oneMinuteAgo = now - 60000;
    this.requestTimestamps = this.requestTimestamps.filter(ts => ts > oneMinuteAgo);
    
    const usage: ApiUsage = {
      id,
      endpoint: insertUsage.endpoint,
      apiKey: insertUsage.apiKey || null,
      timestamp: new Date(),
      success: insertUsage.success || false,
      errorMessage: insertUsage.errorMessage || null,
    };
    this.apiUsage.push(usage);
    return usage;
  }

  async getApiUsage(limit = 100): Promise<ApiUsage[]> {
    return this.apiUsage
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getStatistics(): Promise<{
    requestsPerSecond: number;
    totalRequests: number;
    endpointCount: number;
    dailyRequests: number;
  }> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneDayAgo = now - 86400000; // 24 hours
    
    // Calculate requests per second (average over last minute)
    const recentRequests = this.requestTimestamps.filter(ts => ts > oneMinuteAgo);
    const requestsPerSecond = Math.round(recentRequests.length / 60 * 100) / 100;
    
    // Total requests
    const totalRequests = this.apiUsage.length;
    
    // Endpoint count
    const endpointCount = this.endpoints.length;
    
    // Daily requests
    const dailyRequests = this.apiUsage.filter(usage => 
      usage.timestamp.getTime() > oneDayAgo
    ).length;
    
    return {
      requestsPerSecond,
      totalRequests,
      endpointCount,
      dailyRequests
    };
  }
}

export const storage = new MemStorage();
