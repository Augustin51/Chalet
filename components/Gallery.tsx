import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

interface GalleryPageContent {
  title: string;
  description: string;
  cta_text: string;
  cta_link: string;
}

interface GalleryProps {
  dataContent: GalleryPageContent;
  dataImage: GalleryImage[];
}

export default function Gallery({ dataContent, dataImage }: GalleryProps) {
  
  if (!dataContent || !dataImage) {
    return (
      <section className="bg-white py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center">Chargement...</div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-900 mb-3">
          {dataContent.title}
        </h2>
        <p className="text-emerald-700/80 mb-12 text-lg">
          {dataContent.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {dataImage.map((img) => (
            <div
              key={img.id}
              className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-sm hover:scale-[1.02] transition-transform"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              />
            </div>
          ))}
        </div>

        <Link href={dataContent.cta_link || "/"}>
          <Button className="bg-emerald-800 hover:bg-emerald-700 text-white px-8 py-6 text-base rounded-full shadow-md">
            {dataContent.cta_text}
          </Button>
        </Link>
      </div>
    </section>
  );
}