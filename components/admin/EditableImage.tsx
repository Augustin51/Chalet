'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/components/common/AdminProvider';
import ImageSelectorModal from './ImageSelectorModal';

interface EditableImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  onUpdate: (newImageName: string) => Promise<void>;
}

export default function EditableImage({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  sizes,
  priority,
  quality = 75,
  onUpdate,
}: EditableImageProps) {
  const isAdmin = useAdmin();
  const [showModal, setShowModal] = useState(false);

  const handleSelectImage = async (newImageName: string) => {
    await onUpdate(newImageName);
    setShowModal(false);
  };

  // Props communes pour Image
  const imagePath = src.startsWith('/images/') || src.startsWith('/') ? src : `/images/${src}`;
  
  const imageProps = {
    src: imagePath,
    alt,
    className,
    quality,
    ...(fill ? { fill: true, sizes } : { width, height }),
    ...(priority && { priority: true }),
  };

  if (isAdmin) {
    return (
      <>
        {/* Image cliquable */}
        <div 
          onClick={() => setShowModal(true)} 
          className="cursor-pointer relative group w-full h-full"
        >
          <Image {...imageProps} />
          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Modifier
          </div>
        </div>

        {/* Modal de sélection d'image */}
        <ImageSelectorModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSelect={handleSelectImage}
          title="Modifier l'image"
          currentImage={src}
        />
      </>
    );
  }

  // Mode visiteur : image normale
  return <Image {...imageProps} />;
}
