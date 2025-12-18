"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mountain, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "Le Chalet", href: "/chalet" },
  { name: "Autour du Chalet", href: "/autour" },
  { name: "Calendrier & Tarifs", href: "/calendrier" },
  { name: "Avis", href: "/avis" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo + Title */}
      <div className="flex items-center gap-2">
        <Mountain className="h-6 w-6 sm:h-7 sm:w-7 text-green-700" strokeWidth={2.5} />
        {/* Logo text size: mobile (base) -> sm -> lg */}
        <span className="text-base sm:text-lg lg:text-xl font-bold text-green-900 logo-title"> {/* <-- Classe sémantique ajoutée ici */}
          Le Chalet
        </span>
      </div>

      {/* Desktop Navigation (Visible à partir de md - 768px) */}
      <nav className="hidden md:flex items-center gap-4 lg:gap-6">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                // text-sm par défaut, text-base à partir de lg (1024px)
                "text-sm lg:text-base px-3 py-1 font-medium transition-colors rounded-full nav-link",
                active
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-800 hover:bg-green-50"
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Desktop "Réserver" Button (Visible à partir de md - 768px) */}
      <Button
        asChild
        className="hidden md:flex bg-green-700 hover:bg-green-800 text-white rounded-full px-5 py-2 font-semibold text-sm lg:text-base booking-button"
      >
        <Link href="/calendrier">Réserver</Link>
      </Button>

      {/* Mobile Burger Icon (Visible en dessous de md - 768px) */}
      <button
        className="md:hidden p-2 text-green-800"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay (inchangé) */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-md flex flex-col items-center gap-3 py-5 z-50 animate-fade-in"
          role="menu"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "w-[90%] text-lg font-medium text-center transition-colors px-4 py-2 rounded-full",
                  active
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-800"
                )}
                role="menuitem"
              >
                {link.name}
              </Link>
            );
          })}

          <Button
            asChild
            className="w-[90%] bg-green-700 hover:bg-green-800 text-white rounded-full px-4 py-3 font-semibold text-lg"
          >
            <Link href="/calendrier" onClick={() => setMenuOpen(false)}>
              Réserver
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}