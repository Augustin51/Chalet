"use client";

import { useRef } from "react";

export default function EditableImage({
  admin,
  src,
  alt,
  field,
  component,
  className = "",
}: {
  admin: boolean;
  src: string;
  alt: string;
  field: string;
  component: string;
  className?: string;
}) {
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function uploadImage(file: File) {
    // Upload vers Supabase Storage
    const formData = new FormData();
    formData.append("file", file);
    formData.append("component", component);
    formData.append("key", field);

    await fetch("/api/content/upload-image", {
      method: "POST",
      body: formData,
    });
  }

  if (!admin) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-pointer opacity-80`}
        onClick={() => fileInputRef.current?.click()}
      />

      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
        Modifier
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) uploadImage(e.target.files[0]);
        }}
      />
    </div>
  );
}
