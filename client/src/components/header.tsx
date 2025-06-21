
import { useState } from "react";
import { Menu, X, Code, Zap, Layers } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-white group-hover:text-emerald-400 transition-colors">
                Entegar
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a 
              href="/" 
              className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
            >
              Ana Sayfa
            </a>
            <a 
              href="/docs" 
              className="text-slate-300 hover:text-blue-400 transition-colors font-medium"
            >
              Dokümantasyon
            </a>
            <a 
              href="/projects" 
              className="text-slate-300 hover:text-purple-400 transition-colors font-medium"
            >
              Projeler
            </a>
            <a 
              href="#apis" 
              className="text-slate-300 hover:text-violet-400 transition-colors font-medium"
            >
              API'ler
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="/docs" 
              className="btn-primary text-sm"
            >
              <Code className="w-4 h-4 mr-2" />
              Başla
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/50">
            <nav className="flex flex-col space-y-4">
              <a 
                href="/" 
                className="text-slate-300 hover:text-emerald-400 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </a>
              <a 
                href="/docs" 
                className="text-slate-300 hover:text-blue-400 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Dokümantasyon
              </a>
              <a 
                href="/projects" 
                className="text-slate-300 hover:text-purple-400 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Projeler
              </a>
              <a 
                href="#apis" 
                className="text-slate-300 hover:text-violet-400 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                API'ler
              </a>
              <div className="pt-4">
                <a 
                  href="/docs" 
                  className="btn-primary text-sm inline-flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Başla
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
