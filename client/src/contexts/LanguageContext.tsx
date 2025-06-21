import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  tr: {
    // Header
    'header.title': 'Entegar',
    'header.subtitle': 'REST API Entegrasyon Platformu',
    'header.description': 'Yapay zeka servisleri ve veri çekme API\'leri ile modern animasyonlu arayüz',
    'header.docs': 'Dokümantasyon',
    
    // Hero
    'hero.title': 'Güçlü API Servisleri',
    'hero.subtitle': 'Yapay zeka ve veri entegrasyonu için modern REST API platformu',
    'hero.description': 'Hava durumu, görsel üretimi, IP analizi, içerik moderasyonu ve ses transkripsiyon servisleriyle uygulamanızı güçlendirin.',
    'hero.getStarted': 'Başlayın',
    'hero.viewDocs': 'Dokümantasyonu Görüntüle',
    
    // Statistics
    'stats.requestsPerSecond': 'Saniyede gelen ortalama istek:',
    'stats.totalRequests': 'Şimdiye kadarki toplam istek:',
    'stats.endpointCount': 'Toplam endpoint sayısı:',
    'stats.dailyRequests': 'Bugün gelen istek sayısı:',
    
    // APIs
    'api.weather': 'Hava Durumu',
    'api.weather.desc': 'Detaylı hava durumu bilgileri ve tahminler.',
    'api.image': 'Görsel Üretimi',
    'api.image.desc': 'AI ile yüksek kaliteli görsel oluşturma.',
    'api.ip': 'IP Analizi',
    'api.ip.desc': 'Detaylı IP adresi ve konum bilgileri.',
    'api.moderation': 'İçerik Moderasyonu',
    'api.moderation.desc': 'AI ile metin ve video içerik uygunluk kontrolü.',
    'api.subtitle': 'Otomatik Altyazı',
    'api.subtitle.desc': 'Ses dosyalarından zaman damgalı altyazı üretimi.',
    
    // Footer
    'footer.description': 'Modern web uygulamaları için güçlü API servisleri. Yapay zeka ve veri entegrasyonunu kolaylaştırıyoruz.',
    'footer.apis': 'API\'ler',
    'footer.ai': 'Yapay Zeka',
    'footer.data': 'Veri Çekme',
    'footer.docs': 'Dokümantasyon',
    'footer.status': 'Status',
    'footer.support': 'Destek',
    'footer.contact': 'İletişim',
    'footer.help': 'Yardım',
    'footer.privacy': 'Gizlilik',
    'footer.terms': 'Şartlar',
    'footer.rights': 'Tüm hakları saklıdır.'
  },
  en: {
    // Header
    'header.title': 'Entegar',
    'header.subtitle': 'REST API Integration Platform',
    'header.description': 'AI services and data scraping APIs with modern animated interface',
    'header.docs': 'Documentation',
    
    // Hero
    'hero.title': 'Powerful API Services',
    'hero.subtitle': 'Modern REST API platform for AI and data integration',
    'hero.description': 'Enhance your application with weather data, image generation, IP analysis, content moderation, and audio transcription services.',
    'hero.getStarted': 'Get Started',
    'hero.viewDocs': 'View Documentation',
    
    // Statistics
    'stats.requestsPerSecond': 'Average requests per second:',
    'stats.totalRequests': 'Total requests so far:',
    'stats.endpointCount': 'Total endpoint count:',
    'stats.dailyRequests': 'Today\'s request count:',
    
    // APIs
    'api.weather': 'Weather Data',
    'api.weather.desc': 'Detailed weather information and forecasts.',
    'api.image': 'Image Generation',
    'api.image.desc': 'AI-powered high-quality image creation.',
    'api.ip': 'IP Analysis',
    'api.ip.desc': 'Detailed IP address and location information.',
    'api.moderation': 'Content Moderation',
    'api.moderation.desc': 'AI-powered text and video content appropriateness check.',
    'api.subtitle': 'Auto Subtitles',
    'api.subtitle.desc': 'Timestamped subtitle generation from audio files.',
    
    // Footer
    'footer.description': 'Powerful API services for modern web applications. We make AI and data integration easy.',
    'footer.apis': 'APIs',
    'footer.ai': 'Artificial Intelligence',
    'footer.data': 'Data Scraping',
    'footer.docs': 'Documentation',
    'footer.status': 'Status',
    'footer.support': 'Support',
    'footer.contact': 'Contact',
    'footer.help': 'Help',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.rights': 'All rights reserved.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('tr');

  useEffect(() => {
    // Detect user's location for language switching
    const detectLanguage = async () => {
      try {
        // Try to get user's IP and location using empty IP for auto-detection
        const response = await fetch('/api/ipcheck');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.country_code) {
            const country = data.data.country_code;
            // Turkish for Turkey, Azerbaijan, Cyprus and nearby regions
            const turkishCountries = ['TR', 'AZ', 'CY', 'TM'];
            if (turkishCountries.includes(country)) {
              setLanguage('tr');
            } else {
              setLanguage('en');
            }
            return;
          }
        }
      } catch (error) {
        console.log('Geolocation detection failed, using browser language');
      }
      
      // Fallback to browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('tr')) {
        setLanguage('tr');
      } else {
        setLanguage('en');
      }
    };

    detectLanguage();
  }, []);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}