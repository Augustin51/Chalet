"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Upload, Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import AlertModal from "./AlertModal";

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageName: string) => void;
  title: string;
  currentImage?: string;
}

export default function ImageSelectorModal({
  isOpen,
  onClose,
  onSelect,
  title,
  currentImage,
}: ImageSelectorModalProps) {
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; imageName: string }>({ isOpen: false, imageName: '' });
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; variant: 'success' | 'error' | 'info' }>({ 
    isOpen: false, 
    title: '', 
    message: '', 
    variant: 'info' 
  });

  useEffect(() => {
    if (isOpen) {
      fetch('/api/image/list')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setAvailableImages(data.images);
          }
        })
        .catch((error) => console.error('Erreur chargement images:', error));
    }
  }, [isOpen]);

  const handleUploadNewImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/image/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setAvailableImages([...availableImages, result.fileName]);
        onSelect(result.fileName);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (imageName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmModal({ isOpen: true, imageName });
  };

  const confirmDelete = async () => {
    const imageName = confirmModal.imageName;
    setConfirmModal({ isOpen: false, imageName: '' });

    try {
      const response = await fetch('/api/image/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: imageName }),
      });

      const result = await response.json();
      if (result.success) {
        setAvailableImages(availableImages.filter(img => img !== imageName));
        setAlertModal({
          isOpen: true,
          title: 'Image supprimée',
          message: 'L\'image a été supprimée avec succès',
          variant: 'success'
        });
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Impossible de supprimer',
          message: result.error || 'Une erreur est survenue',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      setAlertModal({
        isOpen: true,
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la suppression',
        variant: 'error'
      });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image actuelle */}
        {currentImage && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Image actuelle :</p>
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={`/images/${currentImage}`}
                alt="Image actuelle"
                fill
                className="object-cover rounded-lg"
                sizes="128px"
              />
            </div>
          </div>
        )}

        {/* Upload */}
        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">Cliquez pour uploader une nouvelle image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await handleUploadNewImage(file);
                }
              }}
            />
          </label>
          {uploading && <p className="text-center text-sm text-gray-500 mt-2">Upload en cours...</p>}
        </div>

        {/* Liste des images existantes */}
        <div>
          <h4 className="font-semibold mb-3">Ou choisir une image existante</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
            {availableImages.map((imageName) => (
              <div key={imageName} className="relative group">
                <button
                  onClick={() => onSelect(imageName)}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-colors w-full"
                >
                  <Image
                    src={`/images/${imageName}`}
                    alt={imageName}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </button>
                <button
                  onClick={(e) => handleDeleteClick(imageName, e)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Supprimer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modales de confirmation et d'alerte */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Supprimer l'image ?"
        message={`Êtes-vous sûr de vouloir supprimer l'image "${confirmModal.imageName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, imageName: '' })}
        variant="danger"
      />
      
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', variant: 'info' })}
      />
    </div>,
    document.body
  );
}
