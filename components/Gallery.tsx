import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";


interface GalleryProps {
  description: string;
  nbPhotoLimit?: number;
}


const IMAGES = [
  { id: 1, src: "/img/placeholder.png", alt: "placeholder" },
  { id: 2, src: "/img/placeholder.png", alt: "placeholder" },
  { id: 3, src: "/img/placeholder.png", alt: "placeholder" },
  { id: 4, src: "/img/placeholder.png", alt: "placeholder" },
  { id: 5, src: "/img/placeholder.png", alt: "placeholder" },
  { id: 6, src: "/img/placeholder.png", alt: "placeholder" },
  { id: 7, src: "/img/placeholder.png", alt: "placeholder" },
  { id: 8, src: "/img/placeholder.png", alt: "placeholder" },
  { id: 9, src: "/img/placeholder.png", alt: "placeholder" },
  { id: 10, src: "/img/placeholder.png", alt: "placeholder" },
  { id: 11, src: "/img/placeholder.png", alt: "placeholder" },
];

export default function Gallery({description, nbPhotoLimit}:GalleryProps) {
  const imagesToShow = nbPhotoLimit
    ? IMAGES.slice(0, nbPhotoLimit)
    : IMAGES;
  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-900 mb-3">
          Galerie
        </h2>
        <p className="text-emerald-700/80 mb-12 text-lg">
          {description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {imagesToShow.map((img) => (
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

        <Link href="/calendrier">
          <Button className="bg-emerald-800 hover:bg-emerald-700 text-white px-8 py-6 text-base rounded-full shadow-md">
            Voir les disponibilités
          </Button>
        </Link>
      </div>
    </section>
  );
}
