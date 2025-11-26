"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useAdmin } from "@/components/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

interface HomeHeroData {
  title: string;
  subtitle: string;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
  image_src: string;
  image_alt: string;
}

export default function HomeHero({ dataContent }: { dataContent: HomeHeroData }) {
  const isAdmin = useAdmin();

  // On connecte le hook d'édition
  const { handleUpdate } = useContentEditor("home", "HomeHero");

  // État de chargement si les données ne sont pas encore là
  if (!dataContent) {
    return (
      <section className="relative h-[85vh] sm:h-[90vh] w-full flex items-center justify-center bg-gray-900">
        <p className="font-serif text-white animate-pulse">Chargement du contenu...</p>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] sm:h-[90vh] w-full flex items-center justify-center text-white overflow-hidden font-serif">
      
      {/* --- IMAGE DE FOND --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src={dataContent.image_src}
          alt={dataContent.image_alt}
          fill
          style={{ objectFit: "cover" }}
          quality={90}
          priority
          className="pointer-events-none" // Empêche de glisser l'image par erreur
        />
        {/* Filtre noir pour la lisibilité */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* --- CONTENU --- */}
      <div className="relative z-20 text-center px-4 max-w-4xl pt-16 sm:pt-20 flex flex-col items-center">
        
        {/* 1. TITRE EDITABLE */}
        {isAdmin ? (
          <input
            type="text"
            defaultValue={dataContent.title}
            onBlur={(e) => handleUpdate(e, "title")} // Sauvegarde quand on clique ailleurs
            onKeyDown={(e) => handleUpdate(e, "title")} // Sauvegarde quand on fait Entrée
            className="w-full text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-white/20 border border-white/30 text-white p-2 rounded focus:outline-none focus:bg-black/50 transition-colors placeholder-gray-300"
          />
        ) : (
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight drop-shadow-md">
            {dataContent.title}
          </h1>
        )}

        {/* 2. SOUS-TITRE EDITABLE */}
        {isAdmin ? (
          <textarea
            defaultValue={dataContent.subtitle}
            onBlur={(e) => handleUpdate(e, "subtitle")}
            onKeyDown={(e) => handleUpdate(e, "subtitle")}
            rows={3}
            className="w-full max-w-2xl text-center text-lg sm:text-xl md:text-2xl mb-8 bg-white/20 border border-white/30 text-white p-2 rounded focus:outline-none focus:bg-black/50 transition-colors"
          />
        ) : (
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {dataContent.subtitle}
          </p>
        )}

        {/* 3. BOUTONS */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
          
          {/* BOUTON PRIMAIRE */}
          {isAdmin ? (
            <div className="flex flex-col gap-1">
               {/* Input pour le texte du bouton */}
              <input
                type="text"
                defaultValue={dataContent.cta_primary_text}
                onBlur={(e) => handleUpdate(e, "cta_primary_text")}
                className="bg-green-700 text-white  text-center font-semibold py-3 px-6 rounded-full border border-white/50 w-full"
                placeholder="Texte bouton 1"
              />
              {/* Input pour le LIEN du bouton (affiché seulement en admin en petit) */}
              <input
                 type="text"
                 defaultValue={dataContent.cta_primary_link}
                 onBlur={(e) => handleUpdate(e, "cta_primary_link")}
                 className="text-xs text-black bg-white/80 p-1 rounded text-center"
                 placeholder="Lien bouton 1 (/exemple)"
              />
            </div>
          ) : (
            <Link
              href={dataContent.cta_primary_link}
              className="group bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-all flex items-center gap-2 shadow-lg hover:scale-105"
            >
              {dataContent.cta_primary_text}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          {/* BOUTON SECONDAIRE */}
          {isAdmin ? (
             <div className="flex flex-col gap-1">
              <input
                type="text"
                defaultValue={dataContent.cta_secondary_text}
                onBlur={(e) => handleUpdate(e, "cta_secondary_text")}
                className="bg-white/10 text-white text-center font-semibold py-3 px-6 rounded-full border border-white/50 w-full"
                placeholder="Texte bouton 2"
              />
               <input
                 type="text"
                 defaultValue={dataContent.cta_secondary_link}
                 onBlur={(e) => handleUpdate(e, "cta_secondary_link")}
                 className="text-xs text-black bg-white/80 p-1 rounded text-center"
                 placeholder="Lien bouton 2"
              />
            </div>
          ) : (
            <Link
              href={dataContent.cta_secondary_link}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-8 rounded-full transition-all hover:scale-105"
            >
              {dataContent.cta_secondary_text}
            </Link>
          )}
        </div>
      </div>

      {/* --- FLÈCHE DE DÉFILEMENT (Animation) --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 text-white/70" />
      </div>

    </section>
  );
}