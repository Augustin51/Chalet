import Image from "next/image";
import React from "react";

interface PageHeroProps {
  title: string;
  description: string;
}

export default function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="relative h-[40vh] sm:h-[50vh] w-full flex items-center justify-center text-white overflow-hidden">
      <Image
        src="/images/placeholder-bg.png"
        alt={`Arrière-plan pour ${title}`}
        layout="fill"
        objectFit="cover"
        quality={80}
        priority
        className="absolute z-0"
      />

      <div className="absolute inset-0 bg-black/60 z-10" />
      
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4 leading-snug">
          {title}
        </h2>

        <p className="text-base sm:text-lg md:text-xl font-light mx-auto max-w-xl">
          {description}
        </p>
      </div>
    </section>
  );
}
