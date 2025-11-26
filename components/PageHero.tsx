"use client";

import Image from "next/image";
import React from "react";
import { useAdmin } from "@/components/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

interface PageHeroData {
  title: string;
  description: string;
  image_src: string;
  image_alt: string;
}

export default function PageHero({ dataContent, page = "chalet" }: { dataContent: PageHeroData; page?: string }) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, "PageHero");

  if (!dataContent) {
    return (
      <section className="relative h-[40vh] sm:h-[50vh] w-full flex items-center justify-center">
        <p>Chargement...</p>
      </section>
    );
  }

  return (
    <section className="relative h-[40vh] sm:h-[50vh] w-full flex items-center justify-center text-white overflow-hidden">
      <Image
        src={dataContent.image_src}
        alt={dataContent.image_alt || `Arrière-plan pour ${dataContent.title}`}
        layout="fill"
        objectFit="cover"
        quality={80}
        priority
        className="absolute z-0"
      />

      <div className="absolute inset-0 bg-black/60 z-10" />
      
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4 leading-snug">
          {isAdmin ? (
            <input
              type="text"
              defaultValue={dataContent.title}
              onBlur={(e) => handleUpdate(e, "title")}
              onKeyDown={(e) => handleUpdate(e, "title")}
              className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white bg-white/20 p-2 rounded text-center"
            />
          ) : (
            dataContent.title
          )}
        </h2>

        <p className="text-base sm:text-lg md:text-xl font-light mx-auto max-w-xl">
          {isAdmin ? (
            <textarea
              defaultValue={dataContent.description}
              onBlur={(e) => handleUpdate(e, "description")}
              onKeyDown={(e) => handleUpdate(e, "description")}
              rows={2}
              className="w-full max-w-xl mx-auto p-2 rounded bg-white/20 text-white"
            />
          ) : (
            dataContent.description
          )}
        </p>
      </div>
    </section>
  );
}