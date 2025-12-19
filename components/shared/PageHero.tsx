"use client";

import Image from "next/image";
import React from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";
import AnimationWrapper from "@/components/common/AnimationWrapper";
import EditableImage from "@/components/admin/EditableImage";
import Loading from "@/components/common/Loading";
import AdminInput from "@/components/admin/inputs/AdminInput";

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
        <Loading size="lg" />
      </section>
    );
  }

  return (
    <section className="relative h-[40vh] sm:h-[50vh] w-full flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 z-0 w-full h-full">
        <EditableImage
          src={dataContent.image_src}
          alt={dataContent.image_alt || `Arrière-plan pour ${dataContent.title}`}
          fill
          quality={80}
          priority
          className="object-cover"
          onUpdate={async (newImageName) => {
            await fetch('/api/content/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                page: page,
                component: 'PageHero',
                key: 'image_src',
                value: newImageName
              })
            });
            window.location.reload();
          }}
        />
      </div>

      <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
      
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <AnimationWrapper variant="wavy" delay={0} className="w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4 leading-snug">
          {isAdmin ? (
            <AdminInput
              value={dataContent.title}
              onUpdate={(e) => handleUpdate(e, "title")}
              className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white bg-transparent border-transparent focus:border-white/30 focus:bg-white/5 p-2 rounded text-center transition-colors"
            />
          ) : (
            dataContent.title
          )}
          </h2>
        </AnimationWrapper>

        <AnimationWrapper variant="fade-up" delay={0.06} className="w-full">
          <p className="text-base sm:text-lg md:text-xl font-light mx-auto max-w-xl">
          {isAdmin ? (
            <AdminInput
              value={dataContent.description}
              onUpdate={(e) => handleUpdate(e, "description")}
              className="w-full max-w-xl mx-auto text-base sm:text-lg md:text-xl font-light text-white bg-transparent border-transparent focus:border-white/30 focus:bg-white/5 p-2 rounded text-center transition-colors"
            />
          ) : (
            dataContent.description
          )}
          </p>
        </AnimationWrapper>
      </div>
    </section>
  );
}