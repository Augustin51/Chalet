"use client";

import React, { useState } from "react";
import { iconMap } from "@/lib/iconMap";
import IconSelectorModal from "@/components/admin/IconSelectorModal";
import { useAdmin } from "@/components/common/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

interface EquipmentData {
  title: string;
}

interface EquipmentItem {
  id: number;
  label: string;
  iconName: string;
}

interface EquipmentProps {
  dataContent: EquipmentData;
  dataEquipment: EquipmentItem[];
  page?: string;
}

export default function Equipment({ dataContent, dataEquipment, page = "chalet" }: EquipmentProps) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, "Equipment");

  if (!dataContent || !dataEquipment) {
    return <section className="bg-white py-16">Chargement...</section>;
  }
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([...dataEquipment].sort((a, b) => a.id - b.id));
  const [iconModalOpen, setIconModalOpen] = useState<{ isOpen: boolean; equipmentId: number | null; currentIcon: string }>({
    isOpen: false,
    equipmentId: null,
    currentIcon: '',
  });
  const [showReloadBar, setShowReloadBar] = useState(false);

  const handleIconSelect = async (iconName: string) => {
    if (!iconModalOpen.equipmentId) return;
    setEquipmentList(prev => prev.map(eq => eq.id === iconModalOpen.equipmentId ? { ...eq, iconName } : eq));
    setShowReloadBar(true);
    // Mise à jour côté serveur
    try {
      await fetch('/api/equipment/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: iconModalOpen.equipmentId,
          field: 'iconName',
          value: iconName,
        }),
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'icône équipement:', error);
    }
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      {showReloadBar && (
        <div
          className="fixed top-0 left-0 w-full bg-yellow-400 text-yellow-900 font-semibold text-center py-0.5 z-[10000] shadow-md cursor-pointer hover:bg-yellow-300 transition-colors text-sm"
          onClick={() => window.location.reload()}
          title="Cliquer pour recharger la page"
        >
          Des modifications sur les icônes nécessitent de <span className="underline">recharger la page</span> pour être totalement prises en compte.<br/>
          <span className="text-xs font-normal">Cliquez ici pour recharger</span>
        </div>
      )}
      {/* ...la liste n'est affichée qu'une seule fois plus bas... */}
      <div className="container mx-auto max-w-6xl">
        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#2c4b3a] mb-8">
          {isAdmin ? (
            <input
              type="text"
              defaultValue={dataContent.title}
              onBlur={(e) => handleUpdate(e, "title")}
              onKeyDown={(e) => handleUpdate(e, "title")}
              className="w-full text-3xl sm:text-4xl font-serif font-bold bg-white/20 p-2 rounded"
            />
          ) : (
            dataContent.title
          )}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...equipmentList].sort((a, b) => a.id - b.id).map((equipment) => {
            const Icon = iconMap[equipment.iconName];
            return (
              <div
                key={equipment.id}
                className="flex flex-col items-center justify-center p-4 sm:p-6 text-center 
                         border border-gray-200 rounded-xl bg-white h-full 
                         transition-all duration-300 hover:border-[#467A5E] hover:shadow-sm"
              >
                <div
                  className={isAdmin ? `mb-2 w-10 h-10 flex items-center justify-center rounded-full border-2 ${iconModalOpen.equipmentId === equipment.id ? 'border-emerald-600 bg-emerald-50' : 'border-[#467A5E]/40'} cursor-pointer hover:bg-emerald-50 transition-colors` : 'mb-2 w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#467A5E]/40'}
                  onClick={() => {
                    if (isAdmin) {
                      setIconModalOpen({
                        isOpen: true,
                        equipmentId: equipment.id,
                        currentIcon: equipment.iconName,
                      });
                    }
                  }}
                  title={isAdmin ? 'Cliquer pour changer l\'icône' : ''}
                >
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[#467A5E]" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-gray-700">{equipment.label}</span>
              </div>
            );
          })}
        </div>
        <IconSelectorModal
          isOpen={iconModalOpen.isOpen}
          onClose={() => setIconModalOpen({ isOpen: false, equipmentId: null, currentIcon: '' })}
          onSelect={handleIconSelect}
          currentIcon={
            iconModalOpen.equipmentId
              ? equipmentList.find(eq => eq.id === iconModalOpen.equipmentId)?.iconName || iconModalOpen.currentIcon
              : iconModalOpen.currentIcon
          }
          title="Choisir une icône"
        />
      </div>
    </section>
  );
}