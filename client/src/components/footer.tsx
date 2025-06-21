import { Plug, Monitor } from "lucide-react";
import { FaDiscord, FaYoutube } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  const { t } = useLanguage();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                <Plug className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Entegar</span>
            </div>
            <p className="text-slate-400 text-sm">
              &copy; 2025 ENTEGAR | Entegar MŞN Development Inc. alt markasıdır.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href={SOCIAL_LINKS.DISCORD} 
              className="text-slate-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110" 
              title="Discord Community"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDiscord className="text-xl" />
            </a>
            <a 
              href={SOCIAL_LINKS.YOUTUBE} 
              className="text-slate-400 hover:text-red-400 transition-all duration-300 transform hover:scale-110" 
              title="YouTube Channel"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="text-xl" />
            </a>
            <a 
              href={SOCIAL_LINKS.SITWATCH} 
              className="text-slate-400 hover:text-green-400 transition-all duration-300 transform hover:scale-110" 
              title="Sitwatch"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Monitor className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
