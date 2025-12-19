"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";
import EditableImage from "@/components/admin/EditableImage";
import Loading from "@/components/common/Loading";
import AdminLinkEditor from "@/components/admin/inputs/AdminLinkEditor";
import { Trash2, Plus } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import ImageSelectorModal from "@/components/admin/ImageSelectorModal";
import AnimationWrapper from "@/components/common/AnimationWrapper";

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
  const [images, setImages] = React.useState<GalleryImage[]>(dataImage);
  const [showAddImageModal, setShowAddImageModal] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });

  React.useEffect(() => {
    setImages(dataImage);
  }, [dataImage]);

  const handleDeleteImage = async (id: number) => {
    try {
      const response = await fetch('/api/image/gallery/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (result.success) {
        setImages(images.filter((img) => img.id !== id));
        setConfirmDelete({ isOpen: false, id: null });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleCreateImage = async (imageName: string) => {
    try {
      const createResponse = await fetch('/api/image/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          src: imageName,
          alt: 'Image de la galerie',
        }),
      });

      const createResult = await createResponse.json();

      if (createResult.success) {
        setShowAddImageModal(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

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
        
        <AnimationWrapper variant="fade-up" delay={0} className="w-full">
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
          <p className="text-emerald-700/80 mb-8 text-lg text-center">
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
        </AnimationWrapper>

        {/* Bouton ajouter une image */}
        {isAdmin && (
          <div className="flex justify-end mb-6">
            <AnimationWrapper variant="pop" delay={0.02} className="inline-block">
              <button
                onClick={() => setShowAddImageModal(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg transition-colors animation-pop animation-hover-raise"
              >
                <Plus className="w-5 h-5" />
                Ajouter une image
              </button>
            </AnimationWrapper>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {images.map((img, i) => (
            <AnimationWrapper key={img.id} variant="fade-up" delay={0.04 + i * 0.03} className="w-full">
              <div
                key={img.id}
                className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-sm group animation-card"
              >
              {isAdmin && (
                <button
                  onClick={() => setConfirmDelete({ isOpen: true, id: img.id })}
                  className="absolute top-2 right-2 z-30 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Supprimer l'image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
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
            </AnimationWrapper>
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

      {/* Modal de confirmation de suppression */}
      {isAdmin && (
        <ConfirmModal
          isOpen={confirmDelete.isOpen}
          onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
          onConfirm={() => confirmDelete.id !== null && handleDeleteImage(confirmDelete.id)}
          title="Supprimer l'image"
          message="Êtes-vous sûr de vouloir supprimer cette image de la galerie ?"
        />
      )}

      {/* Modal d'ajout d'image */}
      <ImageSelectorModal
        isOpen={isAdmin && showAddImageModal}
        onClose={() => setShowAddImageModal(false)}
        onSelect={handleCreateImage}
        title="Ajouter une image à la galerie"
      />
    </section>
  );
}