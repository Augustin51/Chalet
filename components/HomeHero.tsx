import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="relative h-[85vh] sm:h-[90vh] w-full flex items-center justify-center text-white overflow-hidden">
      <Image
        src="/images/placeholder-bg.png"
        alt="Magnifique chalet en bois dans les montagnes enneigées au coucher du soleil"
        layout="fill"
        objectFit="cover"
        quality={90}
        priority
        className="absolute z-0"
      />

      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 text-center px-4 max-w-4xl pt-16 sm:pt-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 leading-tight">
          Le chalet au coeur du Jura
        </h1>

        <p className="text-base sm:text-lg md:text-xl font-light mb-10 mx-auto max-w-xl">
          Un chalet chaleureux entre lacs, forêts et montagnes
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/calendrier"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg shadow-lg bg-[#a67c52] hover:bg-[#8f6b45] transition-colors"
          >
            Réserver maintenant
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <Link
            href="/chalet"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg border border-white/70 hover:bg-white/10 transition-colors"
          >
            Découvrir le chalet
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 z-20">
        <div className="p-3 border border-white/80 rounded-full animate-bounce">
          <ChevronDown className="h-4 w-4 text-white" />
        </div>
      </div>
    </section>
  );
}
