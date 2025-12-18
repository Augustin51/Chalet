// src/components/layout/Footer.tsx

import Link from "next/link";
import { Mountain, MapPin, Phone, Mail } from "lucide-react";

// Interface pour typer les liens de navigation
interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Accueil", href: "/" },
  { name: "Le Chalet", href: "/chalet" },
  { name: "Autour du Chalet", href: "/autour" },
  { name: "Calendrier & Tarifs", href: "/calendrier" },
  { name: "Avis", href: "/avis" },
];

export default function Footer() {
  return (
    // Couleur de fond tirée de l'image
    <footer className="bg-[#467A5E] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Grille principale : 3 colonnes sur desktop, 1 colonne sur mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 pb-10 md:pb-16 border-b border-green-500/50">

          {/* Colonne 1 : Informations générales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mountain className="h-6 w-6 text-white" strokeWidth={2.5} />
              <span className="text-lg md:text-xl font-bold">
                Le Refuge du Haut-Jura
              </span>
            </div>
            
            <p className="text-sm text-green-100/90 max-w-sm">
              Votre chalet chaleureux au cœur du Jura, entre lacs, forêts et montagnes. Vivez une expérience authentique dans un cadre naturel exceptionnel.
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 border-b border-green-500/50 pb-2 md:border-none md:pb-0">
              Navigation
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-green-100 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 border-b border-green-500/50 pb-2 md:border-none md:pb-0">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-green-200" />
                <address className="not-italic text-sm text-green-100">
                  3 route de Champagnole<br/>
                  39520 Foncine-le-Bas<br/>
                  Jura, France

                  
                </address>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-green-200" />
                <div className="text-sm text-green-100 hover:text-white transition-colors">
                  +33 (0)6 06 06 06 06
                </div>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-green-200" />
                <div className="text-sm text-green-100 hover:text-white transition-colors">
                  exemple@gmail.com
                </div>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Section Copyright */}
        <div className="pt-8 text-center text-sm text-green-100/70">
          © 2025 Le chalet. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}