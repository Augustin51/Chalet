"use client";

import EditableField from "@/components/EditableField";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useAdmin } from "@/components/AdminProvider";

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

export default function HomeHero({
  dataContent,
}: {
  dataContent: HomeHeroData;
}) {
  const isAdmin = useAdmin();

  if (!dataContent) {
    return (
      <section className="relative h-[85vh] sm:h-[90vh] w-full flex items-center justify-center bg-gray-900 text-white">
        <p className="font-serif animate-pulse">Chargement du chalet...</p>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] sm:h-[90vh] w-full flex items-center justify-center text-white overflow-hidden font-serif">
      
      {/* --- Background Image --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src={dataContent.image_src}
          alt={dataContent.image_alt}
          fill
          className="object-cover"
          quality={90}
          priority
        />
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* --- Contenu Principal --- */}
      <div className="relative z-20 text-center px-4 max-w-4xl pt-16 sm:pt-20 w-full flex flex-col items-center">
        
        {/* 1. TITRE (Simplifié grâce à la prop 'as="h1"') */}
        <EditableField
          value={dataContent.title}
          page="home"
          component="HomeHero"
          fieldKey="title"
          as="h1"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight w-full text-center drop-shadow-lg"
        />

        {/* 2. SOUS-TITRE (Simplifié grâce à la prop 'as="p"') */}
        <EditableField
          value={dataContent.subtitle}
          page="home"
          component="HomeHero"
          fieldKey="subtitle"
          as="p"
          isTextarea
          className="text-base sm:text-lg md:text-xl font-light mb-10 max-w-xl mx-auto text-center drop-shadow-md"
        />

        {/* 3. BOUTONS D'ACTION */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          
          {/* --- Bouton Primaire --- */}
          {isAdmin ? (
            <EditableField
              value={dataContent.cta_primary_text}
              page="home"
              component="HomeHero"
              fieldKey="cta_primary_text"
              className="px-8 py-3 bg-[#a67c52] rounded-lg shadow-lg text-center w-full sm:w-auto cursor-text"
            />
          ) : (
            <Link
              href={dataContent.cta_primary_link}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg shadow-lg bg-[#a67c52] hover:bg-[#8f6b45] transition-colors w-full sm:w-auto"
            >
              {dataContent.cta_primary_text}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}

          {/* --- Bouton Secondaire --- */}
          {isAdmin ? (
            <EditableField
              value={dataContent.cta_secondary_text}
              page="home"
              component="HomeHero"
              fieldKey="cta_secondary_text"
              className="px-8 py-3 border border-white/70 bg-white/5 backdrop-blur-sm rounded-lg text-center w-full sm:w-auto cursor-text"
            />
          ) : (
            <Link
              href={dataContent.cta_secondary_link}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg border border-white/70 hover:bg-white/10 backdrop-blur-sm transition-colors w-full sm:w-auto"
            >
              {dataContent.cta_secondary_text}
            </Link>
          )}
        </div>
      </div>

      {/* --- Indicateur Scroll Down --- */}
      <div className="absolute bottom-8 z-20">
        <div className="p-3 border border-white/30 bg-white/10 backdrop-blur rounded-full animate-bounce">
          <ChevronDown className="h-5 w-5 text-white" />
        </div>
      </div>
    </section>
  );
}