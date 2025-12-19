"use client";

import React, { useState } from "react";
import { iconMap } from "@/lib/iconMap";
import AnimationWrapper from "@/components/common/AnimationWrapper";
import IconSelectorModal from "@/components/admin/IconSelectorModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export default function Equipment({
  dataContent,
  dataEquipment,
  page = "chalet",
}: EquipmentProps) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, "Equipment");

  /* ------------------------------- States -------------------------------- */
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(
    [...dataEquipment].sort((a, b) => a.id - b.id)
  );
  const [showReloadBar, setShowReloadBar] = useState(false);

  // Modal icône (édition + ajout)
  const [iconModalOpen, setIconModalOpen] = useState<{
    isOpen: boolean;
    equipmentId: number | null;
    currentIcon: string;
  }>({
    isOpen: false,
    equipmentId: null,
    currentIcon: "",
  });

  // Ajout équipement
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEquipmentLabel, setNewEquipmentLabel] = useState("");
  const [newEquipmentIcon, setNewEquipmentIcon] = useState("");
  const [addError, setAddError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null; label: string }>({ isOpen: false, id: null, label: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>("");
  const [editingError, setEditingError] = useState<string>("");

  /* ------------------------------ Guard ---------------------------------- */
  if (!dataContent || !dataEquipment) {
    return <section className="bg-white py-16">Chargement...</section>;
  }

  /* ------------------------------ Handlers -------------------------------- */
  const handleIconSelect = async (iconName: string) => {
    // Cas ajout
    if (iconModalOpen.equipmentId === -1) {
      setNewEquipmentIcon(iconName);
      setIconModalOpen({ isOpen: false, equipmentId: null, currentIcon: "" });
      return;
    }

    // Cas édition
    if (!iconModalOpen.equipmentId) return;

    setEquipmentList(prev =>
      prev.map(eq =>
        eq.id === iconModalOpen.equipmentId ? { ...eq, iconName } : eq
      )
    );

    setShowReloadBar(true);
    setIconModalOpen({ isOpen: false, equipmentId: null, currentIcon: "" });

    try {
      await fetch("/api/equipment/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: iconModalOpen.equipmentId,
          field: "iconName",
          value: iconName,
        }),
      });
    } catch (error) {
      console.error("Erreur mise à jour icône équipement:", error);
    }
  };

  const handleAddEquipment = async () => {
    if (!newEquipmentLabel.trim() || !newEquipmentIcon) {
      setAddError("Veuillez renseigner un label et choisir une icône.");
      return;
    }

    try {
      const res = await fetch("/api/equipment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newEquipmentLabel.trim(), iconName: newEquipmentIcon }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        const err = json?.error || 'Erreur serveur lors de la création';
        setAddError(err);
        return;
      }

      const created: EquipmentItem = json.data;
      setEquipmentList(prev => [...prev, created].sort((a, b) => a.id - b.id));
      setAddModalOpen(false);
      setNewEquipmentLabel("");
      setNewEquipmentIcon("");
      setAddError("");
      setShowReloadBar(true);
    } catch (error) {
      console.error("Erreur ajout équipement:", error);
      setAddError('Erreur lors de la création de l\'équipement');
    }
  };

  /* ------------------------------ Render --------------------------------- */
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 equipment-section">
      {/* Reload bar */}
      {showReloadBar && (
        <div
          className="fixed top-0 left-0 w-full bg-yellow-400 text-yellow-900 font-semibold text-center py-1 z-[10000] shadow cursor-pointer hover:bg-yellow-300 transition-colors text-sm"
          onClick={() => window.location.reload()}
        >
          Des modifications nécessitent de{" "}
          <span className="underline">recharger la page</span>
        </div>
      )}

      <div className="container mx-auto max-w-6xl">
        {/* Admin add button */}
        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <AnimationWrapper variant="pop" delay={0.02} className="inline-block">
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded shadow animation-pop animation-hover-raise"
                onClick={() => setAddModalOpen(true)}
              >
                Ajouter un équipement
              </button>
            </AnimationWrapper>
          </div>
        )}

        {/* Add modal */}
        {addModalOpen && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setAddModalOpen(false)}
              >
                ×
              </button>

              <h4 className="text-lg font-bold mb-4">Ajouter un équipement</h4>

              <label className="block mb-2 font-medium">Label</label>
              <input
                type="text"
                value={newEquipmentLabel}
                onChange={e => setNewEquipmentLabel(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              />

              <label className="block mb-2 font-medium">Icône</label>
              <button
                className="border rounded px-3 py-2 mb-3"
                onClick={() =>
                  setIconModalOpen({
                    isOpen: true,
                    equipmentId: -1,
                    currentIcon: newEquipmentIcon,
                  })
                }
              >
                Choisir une icône
              </button>

              {newEquipmentIcon && (
                <div className="flex items-center gap-2 mb-3">
                  {iconMap[newEquipmentIcon] ? (
                    React.createElement(iconMap[newEquipmentIcon], {
                      className: "h-6 w-6 text-emerald-600",
                    })
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">?</div>
                  )}
                  <span className="text-sm text-gray-600">Icône sélectionnée</span>
                </div>
              )}

              {addError && (
                <div className="text-red-600 text-sm mb-3">{addError}</div>
              )}

              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded w-full"
                onClick={handleAddEquipment}
              >
                Ajouter
              </button>
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#2c4b3a] mb-8">
          {isAdmin ? (
            <input
              type="text"
              defaultValue={dataContent.title}
              onBlur={e => handleUpdate(e, "title")}
              onKeyDown={e => handleUpdate(e, "title")}
              className="w-full bg-white/20 p-2 rounded"
            />
          ) : (
            dataContent.title
          )}
        </h3>

        {/* Equipment grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {equipmentList.map((equipment, i) => {
            const Icon = iconMap[equipment.iconName];
            return (
              <AnimationWrapper key={equipment.id} variant="fade-up" delay={0.03 + i * 0.02} className="w-full">
                <div
                  className="group relative flex flex-col items-center p-4 border rounded-xl hover:shadow-sm transition animation-card animation-hover-raise"
                >
                {isAdmin && (
                  <button
                    onClick={() => setConfirmDelete({ isOpen: true, id: equipment.id, label: equipment.label })}
                    className="absolute top-3 right-3 bg-red-50 text-red-600 p-1.5 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Supprimer cet équipement"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4l1 4H9l1-4z" />
                    </svg>
                  </button>
                )}
                <div
                  className={`mb-2 w-10 h-10 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                    isAdmin
                      ? "hover:bg-emerald-50 border-emerald-400"
                      : "border-emerald-400"
                  }`}
                  onClick={() =>
                    isAdmin &&
                    setIconModalOpen({
                      isOpen: true,
                      equipmentId: equipment.id,
                      currentIcon: equipment.iconName,
                    })
                  }
                >
                  {Icon ? (
                    <Icon className="h-7 w-7 text-[#467A5E]" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">?</div>
                  )}
                </div>
                {isAdmin && editingId === equipment.id ? (
                  <input
                    className="text-sm font-medium text-gray-700 border-b border-dashed focus:outline-none px-1 py-0.5 w-32 text-center"
                    value={editingLabel}
                    onChange={(e) => setEditingLabel(e.target.value)}
                    onBlur={async () => {
                      // save on blur
                      const newLabel = editingLabel.trim();
                      if (!editingId) {
                        setEditingId(null);
                        return;
                      }
                      if (!newLabel) {
                        setEditingError('Le label ne peut pas être vide');
                        return;
                      }
                      // optimistic update
                      setEquipmentList(prev => prev.map(eq => eq.id === editingId ? { ...eq, label: newLabel } : eq));
                      try {
                        const res = await fetch('/api/equipment/update', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: editingId, field: 'label', value: newLabel }),
                        });
                        const json = await res.json();
                        if (!res.ok || !json.success) {
                          console.error('Erreur mise à jour label:', json.error);
                          setEditingError(json?.error || 'Erreur lors de la sauvegarde');
                        }
                      } catch (err) {
                        console.error('Erreur mise à jour label:', err);
                        setEditingError('Erreur lors de la sauvegarde');
                      } finally {
                        setEditingId(null);
                        setEditingLabel('');
                      }
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        (e.target as HTMLElement).blur();
                      }
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditingLabel('');
                        setEditingError('');
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    className="text-sm font-medium text-gray-700 cursor-text"
                    onClick={() => {
                      if (!isAdmin) return;
                      setEditingId(equipment.id);
                      setEditingLabel(equipment.label);
                      setEditingError('');
                    }}
                    title={isAdmin ? 'Cliquez pour modifier' : ''}
                  >
                    {equipment.label}
                  </span>
                )}
                </div>
              </AnimationWrapper>
            );
          })}
        </div>
      </div>

      {/* Icon modal (toujours en fin pour être au-dessus) */}
      <IconSelectorModal
        isOpen={iconModalOpen.isOpen}
        onClose={() =>
          setIconModalOpen({ isOpen: false, equipmentId: null, currentIcon: "" })
        }
        onSelect={handleIconSelect}
        currentIcon={iconModalOpen.currentIcon}
        title="Choisir une icône"
        overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-[10003] p-4"
        onRequireReload={() => setShowReloadBar(true)}
      />

      {/* Confirm deletion modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Supprimer l'équipement ?"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete.label}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={async () => {
          if (!confirmDelete.id) return;
          try {
            const res = await fetch('/api/equipment/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: confirmDelete.id }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
              setEquipmentList(prev => prev.filter(e => e.id !== confirmDelete.id));
              setShowReloadBar(true);
            } else {
              console.error('Erreur suppression:', json.error);
            }
          } catch (error) {
            console.error('Erreur suppression:', error);
          } finally {
            setConfirmDelete({ isOpen: false, id: null, label: '' });
          }
        }}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null, label: '' })}
        variant="danger"
      />
    </section>
  );
}
