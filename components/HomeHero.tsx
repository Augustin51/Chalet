import Image from "next/image";
import Link from "next/link";
import EditableText from "./admin/EditableText";
import EditableImage from "./admin/EditableImage";

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
  isAdmin = false,
}: { 
  dataContent: HomeHeroData;
  isAdmin?: boolean;
}) {

  if (!dataContent) return <p>Chargement...</p>;

  return (
    <section className="relative h-[85vh] sm:h-[90vh] w-full flex items-center justify-center text-white overflow-hidden">

      {/* IMAGE DE FOND EDITABLE */}
      <EditableImage
        admin={isAdmin}
        src={dataContent.image_src}
        alt={dataContent.image_alt}
        field="image_src"
        component="HomeHero"
        className="absolute z-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* TEXTES */}
      <div className="relative z-20 text-center px-4 max-w-4xl pt-16 sm:pt-20">

        <EditableText
          admin={isAdmin}
          value={dataContent.title}
          field="title"
          component="HomeHero"
          as="h1"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 leading-tight"
        />

        <EditableText
          admin={isAdmin}
          value={dataContent.subtitle}
          field="subtitle"
          component="HomeHero"
          as="p"
          className="text-base sm:text-lg md:text-xl font-light mb-10 mx-auto max-w-xl"
        />

        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <Link
            href={dataContent.cta_primary_link}
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg bg-[#a67c52] hover:bg-[#8f6b45]"
          >
            <EditableText
              admin={isAdmin}
              value={dataContent.cta_primary_text}
              field="cta_primary_text"
              component="HomeHero"
            />
          </Link>

          <Link
            href={dataContent.cta_secondary_link}
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg border border-white/70 hover:bg-white/10"
          >
            <EditableText
              admin={isAdmin}
              value={dataContent.cta_secondary_text}
              field="cta_secondary_text"
              component="HomeHero"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
