'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useAdmin } from '@/components/AdminProvider';
import { X, Upload, Trash2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import AlertModal from './AlertModal';

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
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(src);
  
  // États pour les modales de confirmation/alerte
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; imageName: string }>({ isOpen: false, imageName: '' });
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; variant: 'success' | 'error' | 'info' }>({ 
    isOpen: false, 
    title: '', 
    message: '', 
    variant: 'info' 
  });
  
  // État pour gérer le fichier en attente lors d'un doublon
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [duplicateModal, setDuplicateModal] = useState<{ isOpen: boolean; fileName: string }>({ isOpen: false, fileName: '' });

  // Debug
  console.log('EditableImage - isAdmin:', isAdmin);

  // Charger la liste des images disponibles
  useEffect(() => {
    if (showModal) {
      fetch('/api/image/list')
        .then((res) => res.json())
        .then((data) => setAvailableImages(data.images || []))
        .catch((err) => console.error('Erreur lors du chargement des images:', err));
    }
  }, [showModal]);

  // Upload d'une nouvelle image
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        // Ajouter la nouvelle image à la liste
        setAvailableImages([...availableImages, data.fileName]);
        setSelectedImage(data.fileName);
        setAlertModal({
          isOpen: true,
          title: 'Image ajoutée',
          message: `L'image "${data.fileName}" a été ajoutée avec succès`,
          variant: 'success'
        });
      } else if (data.error === 'duplicate') {
        // Fichier en doublon, demander confirmation
        setPendingFile(file);
        setDuplicateModal({
          isOpen: true,
          fileName: data.fileName
        });
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Erreur d\'upload',
          message: data.error || 'Une erreur est survenue lors de l\'upload',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      setAlertModal({
        isOpen: true,
        title: 'Erreur d\'upload',
        message: 'Une erreur est survenue lors de l\'upload',
        variant: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  // Confirmer le renommage du fichier en doublon
  const confirmRename = async () => {
    if (!pendingFile) return;

    setDuplicateModal({ isOpen: false, fileName: '' });
    setUploading(true);

    const formData = new FormData();
    formData.append('file', pendingFile);
    formData.append('forceRename', 'true');

    try {
      const response = await fetch('/api/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setAvailableImages([...availableImages, data.fileName]);
        setSelectedImage(data.fileName);
        setAlertModal({
          isOpen: true,
          title: 'Image ajoutée',
          message: `L'image a été renommée en "${data.fileName}"`,
          variant: 'success'
        });
      } else {
        setAlertModal({
          isOpen: true,
          title: 'Erreur',
          message: data.error || 'Une erreur est survenue',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      setAlertModal({
        isOpen: true,
        title: 'Erreur',
        message: 'Une erreur est survenue lors de l\'upload',
        variant: 'error'
      });
    } finally {
      setUploading(false);
      setPendingFile(null);
    }
  };

  // Supprimer une image
  const handleDelete = async (imageName: string, e: React.MouseEvent) => {
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

      const data = await response.json();
      if (data.success) {
        // Retirer l'image de la liste
        setAvailableImages(availableImages.filter(img => img !== imageName));
        // Si l'image supprimée était sélectionnée, désélectionner
        if (selectedImage === imageName) {
          setSelectedImage(src);
        }
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
          message: data.error || 'Une erreur est survenue',
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

  // Sauvegarder le changement d'image
  const handleSave = async () => {
    await onUpdate(selectedImage);
    setShowModal(false);
  };

  // Props communes pour Image
  // Construire le chemin de l'image (ajouter /images/ seulement si ce n'est pas déjà là)
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

        {/* Modal - Portail fixe en plein écran */}
        {showModal && typeof window !== 'undefined' && createPortal(
          <div 
            className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4" 
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(false);
            }}
          >
            <div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6" 
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Choisir une image</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Upload */}
              <div className="mb-6 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <span className="text-gray-600 font-medium">
                    {uploading ? 'Upload en cours...' : 'Cliquez pour uploader une nouvelle image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Grille d'images */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {availableImages.map((imageName) => (
                  <div
                    key={imageName}
                    onClick={() => setSelectedImage(imageName)}
                    className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-4 transition-all ${
                      selectedImage === imageName ? 'border-green-600 scale-95' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={`/images/${imageName}`}
                      alt={imageName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <button
                      onClick={(e) => handleDelete(imageName, e)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all z-10"
                      title="Supprimer cette image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                      {imageName}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

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
        
        {/* Modal pour fichier en doublon */}
        <ConfirmModal
          isOpen={duplicateModal.isOpen}
          title="Image déjà existante"
          message={`Une image nommée "${duplicateModal.fileName}" existe déjà. Voulez-vous renommer automatiquement la nouvelle image (par ex: "${duplicateModal.fileName.replace(/(\.[^.]+)$/, '(1)$1')}") ?`}
          confirmText="Renommer et ajouter"
          cancelText="Annuler"
          onConfirm={confirmRename}
          onCancel={() => {
            setDuplicateModal({ isOpen: false, fileName: '' });
            setPendingFile(null);
          }}
          variant="warning"
        />
        
        <AlertModal
          isOpen={alertModal.isOpen}
          title={alertModal.title}
          message={alertModal.message}
          variant={alertModal.variant}
          onClose={() => setAlertModal({ isOpen: false, title: '', message: '', variant: 'info' })}
        />
      </>
    );
  }

  // Mode visiteur : image normale
  return <Image {...imageProps} />;
}
