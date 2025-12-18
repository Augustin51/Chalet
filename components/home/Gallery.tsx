"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/components/common/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";
import EditableImage from "@/components/admin/EditableImage";
import Loading from "@/components/common/Loading";
import AdminLinkEditor from "@/components/admin/inputs/AdminLinkEditor";

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

  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor("home", "Gallery");

  if (!dataContent || !dataImage) {
    return (
      <section className="bg-white py-20 px-6 md:px-12">
        <Loading />
      </section>
    );
  }

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-900 mb-3 text-center">
          {isAdmin ? (
            <input
              type="text"
              defaultValue={dataContent.title}
              onBlur={(e) => handleUpdate(e, "title")}
              onKeyDown={(e) => handleUpdate(e, "title")}
              className="w-full text-4xl md:text-5xl font-extrabold bg-white/20 p-2 rounded text-center"
            />
          ) : (
            dataContent.title
          )}
        </h2>
        <p className="text-emerald-700/80 mb-12 text-lg text-center">
          {isAdmin ? (
            <textarea
              defaultValue={dataContent.description}
              onBlur={(e) => handleUpdate(e, "description")}
              onKeyDown={(e) => handleUpdate(e, "description")}
              rows={2}
              className="w-full max-w-3xl mx-auto p-2 rounded bg-white/20 text-center resize-none"
            />
          ) : (
            dataContent.description
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {dataImage.map((img) => (
            <div
              key={img.id}
              className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-sm"
            >
              <div className="hover:scale-[1.02] transition-transform w-full h-full">
                <EditableImage
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  onUpdate={async (newImageName) => {
                    await fetch('/api/image/update', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: img.id, src: newImageName }),
                    });
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          {isAdmin ? (
            <div>
              <AdminLinkEditor
                buttonText={dataContent.cta_text}
                buttonLink={dataContent.cta_link}
                onButtonTextUpdate={(e) => handleUpdate(e, "cta_text")}
                onButtonLinkUpdate={(e) => handleUpdate({ target: { value: e.target.value } } as any, "cta_link")}
                textLabel="Texte du bouton"
                linkLabel="Lien du bouton"
                buttonClassName="bg-emerald-800 text-white px-8 py-3 text-base rounded-full shadow-md text-center font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
          ) : (
            <Link href={dataContent.cta_link || "/"}>
              <Button className="bg-emerald-800 hover:bg-emerald-700 text-white px-8 py-6 text-base rounded-full shadow-md">
                {dataContent.cta_text}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}