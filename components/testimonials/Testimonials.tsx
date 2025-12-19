"use client";

import { useEffect } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";
import { Star, Trash2 } from "lucide-react";
import React from "react";
import Image from "next/image";
import EditableImage from "@/components/admin/EditableImage";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Loading from "@/components/common/Loading";
import AnimationWrapper from "@/components/common/AnimationWrapper";

interface TestimonialContent {
  title: string;
  subtitle: string;
}

interface TestimonialItem {
  id: number;
  name: string;
  avatarUrl: string;
  date: string;
  stars: number;
  source: string;
  review: string;
}

interface TestimonialsProps {
  dataContent: TestimonialContent;
  dataTestimonials: TestimonialItem[];
  availableSources: string[];
}

export default function Testimonials({ dataContent, dataTestimonials, availableSources }: TestimonialsProps) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor("avis", "Testimonials");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [editingStars, setEditingStars] = React.useState<number | null>(null);
  
  // Trier les témoignages par date (du plus récent au plus ancien)
  const sortedTestimonials = React.useMemo(() => {
    return [...dataTestimonials].sort((a, b) => {
      // Convertir les dates françaises en objets Date
      const parseDate = (dateStr: string) => {
        const months: {[key: string]: number} = {
          'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
          'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
        };
        const parts = dateStr.toLowerCase().trim().split(' ');
        
        // Format: "Mois Année" (ex: "Février 2024")
        if (parts.length === 2) {
          const month = months[parts[0]] ?? 0;
          const year = parseInt(parts[1]);
          return new Date(year, month, 1);
        }
        
        // Format: "Jour Mois Année" (ex: "15 janvier 2024")
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = months[parts[1]] ?? 0;
          const year = parseInt(parts[2]);
          return new Date(year, month, day);
        }
        
        return new Date(0);
      };
      return parseDate(b.date).getTime() - parseDate(a.date).getTime();
    });
  }, [dataTestimonials]);
  
  const [testimonials, setTestimonials] = React.useState(sortedTestimonials);
  const [visibleCount, setVisibleCount] = React.useState(6);
  const [newTestimonial, setNewTestimonial] = React.useState({
    name: '',
    avatarUrl: '/images/avatar-default.jpg',
    date: new Date().toLocaleDateString('fr-FR'),
    stars: 5,
    source: availableSources[0] || 'Google',
    review: ''
  });

  useEffect(() => {
    if (isAdmin) {
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach((textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }
  }, [isAdmin, dataTestimonials]);

  // Mettre à jour l'état local quand sortedTestimonials change
  React.useEffect(() => {
    setTestimonials(sortedTestimonials);
  }, [sortedTestimonials]);

  const handleTestimonialUpdate = async (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>,
    testimonialId: number,
    field: string
  ) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") {
      return;
    }

    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const value = target.value;

    // Mettre à jour l'état local immédiatement
    if (field === 'stars') {
      setTestimonials(prev => 
        prev.map(t => t.id === testimonialId ? { ...t, stars: parseInt(value) } : t)
      );
    }

    try {
      const response = await fetch("/api/testimonial/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: testimonialId, field, value }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Erreur:", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.review) {
      alert('Le nom et l\'avis sont requis');
      return;
    }

    try {
      const response = await fetch('/api/testimonial/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial)
      });

      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        setNewTestimonial({
          name: '',
          avatarUrl: '/images/avatar-default.jpg',
          date: new Date().toLocaleDateString('fr-FR'),
          stars: 5,
          source: availableSources[0] || 'Google',
          review: ''
        });
        window.location.reload();
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avis:', error);
      alert('Erreur lors de l\'ajout de l\'avis');
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!confirmDelete.id) return;

    try {
      const response = await fetch('/api/testimonial/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: confirmDelete.id })
      });

      const data = await response.json();
      if (data.success) {
        setConfirmDelete({ isOpen: false, id: null });
        window.location.reload();
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avis:', error);
      alert('Erreur lors de la suppression de l\'avis');
    }
  };

  if (!dataContent || !dataTestimonials) {
    return <section className="bg-[#fcfaf7] py-16"><Loading /></section>;
  }

  return (
    <section className="bg-[#fcfaf7] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <AnimationWrapper variant="fade-up" delay={0} className="w-full">
          <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-3">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.title}
                onBlur={(e) => handleUpdate(e, "title")}
                onKeyDown={(e) => handleUpdate(e, "title")}
                className="w-full text-center text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] bg-transparent border border-transparent px-2 py-1 mb-3 focus:outline-none focus:border-[#2c4b3a]/30 focus:bg-white/10 rounded transition-colors"
              />
            ) : (
              dataContent.title
            )}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.subtitle}
                onBlur={(e) => handleUpdate(e, "subtitle")}
                onKeyDown={(e) => handleUpdate(e, "subtitle")}
                className="w-full max-w-2xl mx-auto text-center text-lg text-gray-600 bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-gray-600/30 focus:bg-white/10 rounded transition-colors"
              />
            ) : (
              dataContent.subtitle
            )}
          </p>
        </div>
        </AnimationWrapper>

        <div className="flex justify-end mb-4">
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#2c4b3a] text-white rounded-lg hover:bg-[#467A5E] transition-colors text-sm font-medium"
            >
              Ajouter un avis
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {testimonials.slice(0, visibleCount).map((testimonial, i) => (
            <AnimationWrapper key={testimonial.id} variant="fade-up" delay={0.04 + i * 0.03} className="w-full">
              <div 
                key={testimonial.id}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 h-full relative animation-card"
              >
              {isAdmin && (
                <button
                  onClick={() => setConfirmDelete({ isOpen: true, id: testimonial.id })}
                  className="absolute top-4 left-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors z-10"
                  title="Supprimer cet avis"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <div className="absolute top-4 right-4 bg-[#e9f3ef] text-[#2c4b3a] text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                {isAdmin ? (
                  <select
                    defaultValue={testimonial.source}
                    onChange={(e) => handleTestimonialUpdate(e, testimonial.id, "source")}
                    className="bg-transparent text-[#2c4b3a] text-sm font-semibold border border-transparent px-1 rounded text-center min-w-[80px] focus:outline-none focus:border-[#2c4b3a]/30 cursor-pointer transition-colors"
                  >
                    {availableSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                ) : (
                  testimonial.source
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <EditableImage 
                    src={testimonial.avatarUrl}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    onUpdate={async (newImageName) => {
                      await fetch('/api/testimonial/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          id: testimonial.id,
                          field: 'avatarUrl',
                          value: newImageName
                        })
                      });
                      window.location.reload();
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#2c4b3a]">
                    {isAdmin ? (
                      <input
                        type="text"
                        defaultValue={testimonial.name}
                        onBlur={(e) => handleTestimonialUpdate(e, testimonial.id, "name")}
                        onKeyDown={(e) => handleTestimonialUpdate(e, testimonial.id, "name")}
                        className="w-full font-semibold text-[#2c4b3a] bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-[#2c4b3a]/30 focus:bg-white/10 rounded transition-colors"
                      />
                    ) : (
                      testimonial.name
                    )}
                  </p>
                  <div className="flex items-center">
                    {isAdmin && editingStars === testimonial.id ? (
                      <select
                        defaultValue={testimonial.stars}
                        onChange={(e) => {
                          handleTestimonialUpdate(e, testimonial.id, "stars");
                          setEditingStars(null);
                        }}
                        onBlur={() => setEditingStars(null)}
                        autoFocus
                        className="text-sm border border-[#2c4b3a]/30 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2c4b3a]/50"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} étoile{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div 
                        className={`flex ${isAdmin ? 'cursor-pointer' : ''}`}
                        onClick={() => isAdmin && setEditingStars(testimonial.id)}
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star 
                            key={index}
                            className={`h-4 w-4 ${index < testimonial.stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            strokeWidth={1}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {isAdmin ? (
                      <input
                        type="text"
                        defaultValue={testimonial.date}
                        onBlur={(e) => handleTestimonialUpdate(e, testimonial.id, "date")}
                        onKeyDown={(e) => handleTestimonialUpdate(e, testimonial.id, "date")}
                        className="w-full text-sm text-gray-500 bg-transparent border border-transparent px-2 py-0.5 focus:outline-none focus:border-gray-500/30 focus:bg-white/10 rounded transition-colors"
                      />
                    ) : (
                      testimonial.date
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex-grow mt-2">
                <div className="text-4xl font-serif text-[#467A5E] mb-3 leading-none">
                  "
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  {isAdmin ? (
                    <textarea
                      defaultValue={testimonial.review}
                      onBlur={(e) => handleTestimonialUpdate(e, testimonial.id, "review")}
                      onKeyDown={(e) => handleTestimonialUpdate(e, testimonial.id, "review")}
                      onInput={(e: any) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      className="w-full text-gray-700 leading-relaxed italic bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-gray-700/30 focus:bg-white/10 rounded transition-colors resize-none overflow-hidden min-h-[3rem]"
                    />
                  ) : (
                    testimonial.review
                  )}
                </p>
              </div>
            </div>
            </AnimationWrapper>
          ))}
        </div>

        {visibleCount < testimonials.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-6 py-3 bg-[#2c4b3a] text-white rounded-lg hover:bg-[#467A5E] transition-colors font-medium"
            >
              Voir plus d'avis
            </button>
          </div>
        )}
        
      </div>

      {/* Modal d'ajout d'avis */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-2xl font-bold text-[#2c4b3a]">Ajouter un avis</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c4b3a]/50"
                  placeholder="Nom du client"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  value={newTestimonial.date}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c4b3a]/50"
                  placeholder="ex: 15 janvier 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (étoiles)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newTestimonial.stars}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, stars: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c4b3a]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={newTestimonial.source}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c4b3a]/50"
                >
                  {availableSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avis *</label>
                <textarea
                  value={newTestimonial.review}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, review: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c4b3a]/50 resize-none"
                  rows={5}
                  placeholder="Le texte de l'avis..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddTestimonial}
                className="px-4 py-2 bg-[#2c4b3a] text-white rounded-lg hover:bg-[#467A5E] transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Supprimer cet avis ?"
        message="Cette action est irréversible. L'avis sera définitivement supprimé."
        onConfirm={handleDeleteTestimonial}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
      />
    </section>
  );
}