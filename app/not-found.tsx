import Link from "next/link";
import { Mountain, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo et titre */}
        <div className="flex flex-col items-center mb-8">
          <Mountain className="h-16 w-16 text-green-700 mb-4" strokeWidth={2} />
          <h1 className="text-6xl sm:text-8xl font-bold text-green-900 mb-4">404</h1>
          <div className="h-1 w-24 bg-green-700 rounded-full mb-6"></div>
        </div>

        {/* Message d'erreur */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          La page que vous recherchez semble avoir pris un chemin de montagne inconnu...
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-6 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Retour à l'accueil
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-2 border-green-700 text-green-700 hover:bg-green-50 px-6 py-6 rounded-full text-base font-medium transition-all"
          >
            <Link href="/contact" className="flex items-center gap-2">
              Nous contacter
            </Link>
          </Button>
        </div>

        {/* Liens rapides */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Liens rapides :</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/chalet" className="text-green-700 hover:text-green-800 hover:underline">
              Le Chalet
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/autour" className="text-green-700 hover:text-green-800 hover:underline">
              Autour du Chalet
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/calendrier" className="text-green-700 hover:text-green-800 hover:underline">
              Calendrier & Tarifs
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/avis" className="text-green-700 hover:text-green-800 hover:underline">
              Avis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
