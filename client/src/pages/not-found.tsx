import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Sayfa Bulunamadı</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              <Home className="w-5 h-5 mr-2" />
              Ana Sayfa
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri Dön
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;