"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2 } from "lucide-react";
import { iconMap } from "@/lib/iconMap";
import ConfirmModal from "./ConfirmModal";
import AlertModal from "./AlertModal";

interface IconSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
  currentIcon?: string;
  title?: string;
  overlayClassName?: string;
  onRequireReload?: () => void;
}

export default function IconSelectorModal({
  isOpen,
  onClose,
  onSelect,
  currentIcon,
  title = "Choisir une icône",
  overlayClassName,
  onRequireReload,
}: IconSelectorModalProps) {
  const [showReloadBar, setShowReloadBar] = useState(false);
  // DEBUG: log props pour comprendre le bug d'ouverture
  // (doit être dans le corps, après les variables)
  const [newIconName, setNewIconName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // On masque Star dans la sélection, mais elle reste accessible pour l'affichage de l'icône actuelle
  const [availableIcons, setAvailableIcons] = useState<string[]>(Object.keys(iconMap));
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; iconName: string }>({ isOpen: false, iconName: '' });
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; variant: 'success' | 'error' | 'info' }>({ 
    isOpen: false, 
    title: '', 
    message: '', 
    variant: 'info' 
  });

  if (!isOpen) return null;

  // Masquer Star dans la liste de sélection
  const iconNames = availableIcons.filter(name => name !== 'Star');

  const handleSelect = (iconName: string) => {
    onSelect(iconName);
    // Ne ferme plus le modal ici, le parent gère la fermeture si besoin
  };

  const handleAddIcon = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsAdding(true);

    // Convertir en PascalCase : map-pin → MapPin, arrow-right → ArrowRight
    const trimmedName = newIconName.trim();
    const iconNameToAdd = trimmedName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    try {
      const response = await fetch('/api/icon/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iconName: iconNameToAdd }),
      });

      const result = await response.json();

      if (result.success) {
        // Ajouter l'icône à la liste locale et notifier le parent
        setAvailableIcons(prev => [...prev, iconNameToAdd]);
        onSelect(iconNameToAdd);
        // Ne pas recharger automatiquement — notifier le parent pour afficher la barre globale
        if (typeof onRequireReload === 'function') onRequireReload();
        setShowReloadBar(true);
        onClose();
      } else {
        setErrorMessage(result.error || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      setErrorMessage('Erreur de connexion');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteClick = (iconName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmModal({ isOpen: true, iconName });
  };

  const confirmDelete = async () => {
    const iconName = confirmModal.iconName;
    setConfirmModal({ isOpen: false, iconName: '' });

    try {
      const response = await fetch('/api/icon/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iconName }),
      });

      const result = await response.json();
      if (result.success) {
        // Suppression immédiate côté client
        setAvailableIcons(prev => prev.filter(name => name !== iconName));
        // notifier le parent pour afficher la barre globale
        if (typeof onRequireReload === 'function') onRequireReload();
        setShowReloadBar(true);
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

  return createPortal(
    <>
      {showReloadBar && (
        <div className="fixed top-0 left-0 w-full bg-yellow-400 text-yellow-900 font-semibold text-center py-2 z-[10000] shadow-md animate-pulse">
          Des modifications sur les icônes nécessitent de <span className="underline">recharger la page</span> pour être totalement prises en compte.
        </div>
      )}
      <div 
            className={overlayClassName ?? "fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"}
            onClick={onClose}
          >
        <div 
          className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Icône actuelle */}
          {currentIcon && iconMap[currentIcon] && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Icône actuelle :</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-700/40 flex items-center justify-center">
                  {React.createElement(iconMap[currentIcon], {
                    className: "w-7 h-7 text-emerald-700",
                  })}
                </div>
                <span className="text-sm font-medium text-gray-700">{currentIcon}</span>
              </div>
            </div>
          )}

          {/* Formulaire d'ajout d'icône */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2 text-blue-900">Ajouter une icône Lucide</h4>
            <p className="text-xs text-blue-700 mb-3">
              Consultez <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">lucide.dev</a> pour trouver le nom exact (ex: Home, Users)
            </p>
            <form onSubmit={handleAddIcon} className="flex gap-2">
              <input
                type="text"
                value={newIconName}
                onChange={(e) => setNewIconName(e.target.value)}
                placeholder="Nom de l'icône (ex: Home)"
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isAdding}
              />
              <button
                type="submit"
                disabled={isAdding || !newIconName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {isAdding ? 'Ajout...' : 'Ajouter'}
              </button>
            </form>
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>

          {/* Liste des icônes */}
          <div>
            <h4 className="font-semibold mb-3">Choisir une icône ({iconNames.length} disponibles)</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {iconNames.map((iconName) => {
                const Icon = iconMap[iconName];
                const isSelected = currentIcon === iconName;
                // Skip si l'icône n'existe pas dans iconMap (peut arriver pendant la suppression)
                if (!Icon) return null;
                return (
                  <div key={iconName} className="relative group">
                    <button
                      onClick={() => handleSelect(iconName)}
                      className={`w-full flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all hover:border-emerald-500 hover:bg-emerald-50 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200"
                      }`}
                      title={iconName}
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-emerald-700/40 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-emerald-700" />
                      </div>
                      <span className="text-xs text-gray-600 text-center truncate w-full">
                        {iconName}
                      </span>
                    </button>
                  {iconName !== 'Default' && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(iconName, e); }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-[10005] pointer-events-auto"
                        title="Supprimer"
                        aria-label={`Supprimer l'icône ${iconName}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modales de confirmation et d'alerte */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Supprimer l'icône ?"
        message={`Êtes-vous sûr de vouloir supprimer l'icône "${confirmModal.iconName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, iconName: '' })}
        variant="danger"
      />
      
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', variant: 'info' })}
      />
    </div>
    </>,
    document.body
  );
}
