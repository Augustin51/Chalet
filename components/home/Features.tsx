"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { iconMap } from "@/lib/iconMap";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";
import IconSelectorModal from "@/components/admin/IconSelectorModal";
import AnimationWrapper from "@/components/common/AnimationWrapper";

interface FeatureFromDB {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

interface PageContent {
  title: string;
  subtitle: string;
}

interface FeaturesProps {
  dataContent: PageContent;
  dataFeature: FeatureFromDB[];
}


export default function Features({ dataContent, dataFeature }: FeaturesProps) {
  if (!dataContent || !dataFeature) {
    return <section className="bg-[#efe9e0] py-16">Chargement...</section>;
  }

  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor("home", "Features");
  const [iconModalOpen, setIconModalOpen] = useState<{ isOpen: boolean; featureId: number | null; currentIcon: string }>({
    isOpen: false,
    featureId: null,
    currentIcon: '',
  });
  const [features, setFeatures] = useState<FeatureFromDB[]>(dataFeature);
  const [showReloadBar, setShowReloadBar] = useState(false);

  const handleIconSelect = async (iconName: string) => {
    if (!iconModalOpen.featureId) return;

    // Mise à jour immédiate côté client
    setFeatures(prev => prev.map(f =>
      f.id === iconModalOpen.featureId ? { ...f, iconName } : f
    ));
    setShowReloadBar(true);
    // Ne ferme plus le modal pour laisser l'interface ouverte

    // Mise à jour côté serveur
    try {
      await fetch('/api/feature/update-icon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureId: iconModalOpen.featureId,
          iconName,
        }),
      });
      // Pas de reload automatique
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'icône:', error);
    }
  };

  return (
    <section className="bg-[#efe9e0] py-16 px-6 md:px-12 features-section">
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
      <div className="max-w-6xl mx-auto text-center">
        <AnimationWrapper variant="pop" delay={0} className="mx-auto max-w-4xl">
          <h2 className="w-full max-w-4xl mx-auto text-4xl md:text-5xl font-extrabold text-emerald-900 mb-4 text-center">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.title}
                onBlur={(e) => handleUpdate(e, "title")}
                onKeyDown={(e) => handleUpdate(e, "title")}
                className="w-full max-w-4xl mx-auto text-center text-4xl md:text-5xl font-extrabold text-emerald-900 bg-transparent border border-transparent px-2 py-1 mb-4 focus:outline-none focus:border-emerald-900/30 focus:bg-white/10 rounded transition-colors"
              />
            ) : (
              dataContent.title
            )}
          </h2>
        </AnimationWrapper>

        <AnimationWrapper variant="fade-up" delay={0.06} className="max-w-3xl mx-auto">
          <p className="text-emerald-700/80 mb-12 text-center max-w-3xl mx-auto">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.subtitle}
                onBlur={(e) => handleUpdate(e, "subtitle")}
                onKeyDown={(e) => handleUpdate(e, "subtitle")}
                className="w-full max-w-3xl mx-auto text-center text-emerald-700/80 bg-transparent border border-transparent px-2 py-1 mb-12 focus:outline-none focus:border-emerald-700/30 focus:bg-white/10 rounded transition-colors"
              />
            ) : (
              dataContent.subtitle
            )}
          </p>
        </AnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = iconMap[f.iconName];
            return (
              <AnimationWrapper key={f.id} variant="pop" delay={idx * 0.06} className="w-full">
                <Card className="rounded-2xl shadow-sm">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div 
                      className={`w-16 h-16 rounded-full border-2 border-emerald-700/40 flex items-center justify-center mb-4 ${
                        isAdmin ? 'cursor-pointer hover:bg-emerald-50 transition-colors' : ''
                      }`}
                      onClick={() => {
                        if (isAdmin) {
                          setIconModalOpen({
                            isOpen: true,
                            featureId: f.id,
                            currentIcon: f.iconName,
                          });
                        }
                      }}
                      title={isAdmin ? 'Cliquer pour changer l\'icône' : ''}
                    >
                      {Icon ? (
                        <Icon className="w-7 h-7 text-emerald-700" aria-hidden />
                      ) : (
                        <span className="w-7 h-7 flex items-center justify-center text-gray-400">?</span>
                      )}
                    </div>
                    {isAdmin ? (
                      <>
                        <input
                          type="text"
                          defaultValue={f.title}
                          onBlur={(e) => handleUpdate(e, `feature_${f.id}_title`)}
                          onKeyDown={(e) =>
                            handleUpdate(e, `feature_${f.id}_title`)
                          }
                          className="w-full text-center text-xl font-semibold text-emerald-900 mb-2 bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-emerald-900/30 focus:bg-white/10 rounded transition-colors"
                        />
                        <textarea
                          defaultValue={f.description}
                          onBlur={(e) => handleUpdate(e, `feature_${f.id}_description`)}
                          rows={2}
                          className="w-full text-center text-emerald-700/80 bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-emerald-700/30 focus:bg-white/10 rounded transition-colors resize-none"
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-emerald-900 mb-2 text-center">
                          {f.title}
                        </h3>
                        <p className="text-emerald-700/80 text-center">
                          {f.description}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </AnimationWrapper>
            );
          })}
        </div>

        {/* Modal de sélection d'icône (en dehors du map) */}
        <IconSelectorModal
          isOpen={iconModalOpen.isOpen}
          onClose={() => setIconModalOpen({ isOpen: false, featureId: null, currentIcon: '' })}
          onSelect={handleIconSelect}
          currentIcon={
            iconModalOpen.featureId
              ? features.find(f => f.id === iconModalOpen.featureId)?.iconName || iconModalOpen.currentIcon
              : iconModalOpen.currentIcon
          }
          title="Choisir une icône"
        />
      </div>
    </section>
  );
}
