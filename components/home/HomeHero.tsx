"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useAdmin } from "@/components/common/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";
import EditableImage from "@/components/admin/EditableImage";
import Loading from "@/components/common/Loading";
import AdminLinkEditor from "@/components/admin/inputs/AdminLinkEditor";

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
        <Loading text="Chargement du contenu" size="lg" />
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] sm:h-[90vh] w-full flex items-center justify-center text-white overflow-hidden font-serif">
      
      {/* --- IMAGE DE FOND --- */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <EditableImage
          src={dataContent.image_src}
          alt={dataContent.image_alt}
          fill
          quality={90}
          priority
          className="object-cover"
          onUpdate={async (newImageName) => {
            await fetch('/api/content/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                page: 'home',
                component: 'HomeHero',
                key: 'image_src',
                value: newImageName
              })
            });
            window.location.reload();
          }}
        />
        {/* Filtre noir pour la lisibilité */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* --- CONTENU --- */}
      <div className="relative z-20 text-center px-4 max-w-4xl pt-16 sm:pt-20 flex flex-col items-center">
        
        {/* 1. TITRE EDITABLE */}
        {isAdmin ? (
          <textarea
            defaultValue={dataContent.title}
            onBlur={(e) => handleUpdate(e, "title")}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleUpdate(e, "title");
              }
            }}
            rows={2}
            className="w-full text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white drop-shadow-md bg-transparent border border-transparent px-2 py-1 mb-6 focus:outline-none focus:border-white/40 focus:bg-black/20 rounded transition-colors resize-none"
          />
        ) : (
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight drop-shadow-md">
            {dataContent.title}
          </h1>
        )}

        {/* 2. SOUS-TITRE EDITABLE */}
        {isAdmin ? (
          <input
            type="text"
            defaultValue={dataContent.subtitle}
            onBlur={(e) => handleUpdate(e, "subtitle")}
            onKeyDown={(e) => handleUpdate(e, "subtitle")}
            className="w-full max-w-2xl text-center text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed drop-shadow-sm bg-transparent border border-transparent px-2 py-1 mb-10 mx-auto focus:outline-none focus:border-white/40 focus:bg-black/20 rounded transition-colors"
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
            <div className="w-full sm:w-auto">
              <AdminLinkEditor
                buttonText={dataContent.cta_primary_text}
                buttonLink={dataContent.cta_primary_link}
                onButtonTextUpdate={(e) => handleUpdate(e, "cta_primary_text")}
                onButtonLinkUpdate={(e) => handleUpdate({ target: { value: e.target.value } } as any, "cta_primary_link")}
                textLabel="Texte bouton principal"
                linkLabel="Lien bouton principal"
                buttonClassName="bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg text-center border border-transparent focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
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
            <div className="w-full sm:w-auto">
              <AdminLinkEditor
                buttonText={dataContent.cta_secondary_text}
                buttonLink={dataContent.cta_secondary_link}
                onButtonTextUpdate={(e) => handleUpdate(e, "cta_secondary_text")}
                onButtonLinkUpdate={(e) => handleUpdate({ target: { value: e.target.value } } as any, "cta_secondary_link")}
                textLabel="Texte bouton secondaire"
                linkLabel="Lien bouton secondaire"
                buttonClassName="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-8 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
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