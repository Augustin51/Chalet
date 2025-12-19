"use client";

import React, { useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";
import { iconMap } from "@/lib/iconMap";
import IconSelectorModal from "@/components/admin/IconSelectorModal";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";
import Loading from "@/components/common/Loading";
import AnimationWrapper from "@/components/common/AnimationWrapper";

interface FavoritesContent {
  title: string;
  subtitle: string;
}
interface FavoriteItem {
  id: number;
  iconName: string;
  title: string;
  details: string;
}

interface LocalFavoritesProps {
  dataContent: FavoritesContent;
  dataFavorites: FavoriteItem[];
  page?: string;
}

export default function LocalFavorites({ dataContent, dataFavorites, page = "autour" }: LocalFavoritesProps) {
  if (!dataContent || !dataFavorites) {
    return <section className="bg-[#f5f3ef] py-16"><Loading /></section>;
  }

  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, "LocalFavorites");
  const subtitleRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
  };

  useEffect(() => {
    if (isAdmin) {
      // Ajuster la hauteur de tous les textareas au chargement
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach((textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }
  }, [isAdmin, dataContent, dataFavorites]);

  const [favorites, setFavorites] = useState<FavoriteItem[]>(dataFavorites);
  const [iconModalOpen, setIconModalOpen] = useState<{ isOpen: boolean; favoriteId: number | null; currentIcon: string }>({
    isOpen: false,
    favoriteId: null,
    currentIcon: '',
  });
  const [showReloadBar, setShowReloadBar] = useState(false);

  const handleIconSelect = async (iconName: string) => {
    if (!iconModalOpen.favoriteId) return;
    setFavorites(prev => prev.map(fav => fav.id === iconModalOpen.favoriteId ? { ...fav, iconName } : fav));
    setShowReloadBar(true);
    // Optionally, update server here if needed
  };

  return (
    <section className="bg-[#f5f3ef] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-6xl mx-auto">
        <AnimationWrapper variant="fade-up" delay={0} className="w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-3">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.title}
                onBlur={(e) => handleUpdate(e, "title")}
                onKeyDown={(e) => handleUpdate(e, "title")}
                className="w-full text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] bg-transparent border-transparent focus:border-[#2c4b3a]/30 focus:bg-white/5 p-2 rounded text-center transition-colors"
              />
            ) : (
              dataContent.title
            )}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isAdmin ? (
              <textarea
                defaultValue={dataContent.subtitle}
                onBlur={(e) => handleUpdate(e, "subtitle")}
                onKeyDown={(e) => handleUpdate(e, "subtitle")}
                onInput={autoResize}
                className="w-full max-w-2xl mx-auto text-lg text-gray-600 bg-transparent border-transparent focus:border-gray-600/30 focus:bg-white/5 p-2 rounded text-center transition-colors resize-none overflow-hidden min-h-[3rem]"
              />
            ) : (
              dataContent.subtitle
            )}
            </p>
          </div>
        </AnimationWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {favorites.map((favorite, i) => {
            const Icon = iconMap[favorite.iconName];
            return (
              <AnimationWrapper key={favorite.id} variant="fade-up" delay={0.04 + i * 0.02} className="w-full">
                <div
                  key={favorite.id}
                  className="bg-white p-6 sm:p-8 rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-lg border border-gray-100 h-full animation-card"
                >
                <div
                  className={isAdmin ? `mb-4 w-10 h-10 flex items-center justify-center rounded-full border-2 ${iconModalOpen.favoriteId === favorite.id ? 'border-emerald-600 bg-emerald-50' : 'border-[#467A5E]/40'} cursor-pointer hover:bg-emerald-50 transition-colors` : 'mb-4 w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#467A5E]/40'}
                  onClick={() => {
                    if (isAdmin) {
                      setIconModalOpen({
                        isOpen: true,
                        favoriteId: favorite.id,
                        currentIcon: favorite.iconName,
                      });
                    }
                  }}
                  title={isAdmin ? 'Cliquer pour changer l\'icône' : ''}
                >
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[#467A5E]" strokeWidth={2} />
                </div>
                {isAdmin ? (
                  <>
                    <input
                      type="text"
                      defaultValue={favorite.title}
                      onBlur={(e) => handleUpdate(e, `favorite_${favorite.id}_title`)}
                      onKeyDown={(e) => handleUpdate(e, `favorite_${favorite.id}_title`)}
                      className="text-xl font-semibold text-[#2c4b3a] mb-2 bg-transparent border-transparent focus:border-[#2c4b3a]/30 focus:bg-white/5 p-1 rounded w-full transition-colors"
                    />
                    <textarea
                      defaultValue={favorite.details}
                      onBlur={(e) => handleUpdate(e, `favorite_${favorite.id}_details`)}
                      onKeyDown={(e) => handleUpdate(e, `favorite_${favorite.id}_details`)}
                      onInput={autoResize}
                      className="text-base text-[#467A5E] w-full p-1 rounded bg-transparent border-transparent focus:border-[#467A5E]/30 focus:bg-white/5 transition-colors resize-none overflow-hidden min-h-[4rem]"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-[#2c4b3a] mb-2">{favorite.title}</h3>
                    <p className="text-base text-[#467A5E]">{favorite.details}</p>
                  </>
                )}
              </div>
              </AnimationWrapper>
            );
          })}
        </div>
        <IconSelectorModal
          isOpen={iconModalOpen.isOpen}
          onClose={() => setIconModalOpen({ isOpen: false, favoriteId: null, currentIcon: '' })}
          onSelect={handleIconSelect}
          currentIcon={
            iconModalOpen.favoriteId
              ? favorites.find(fav => fav.id === iconModalOpen.favoriteId)?.iconName || iconModalOpen.currentIcon
              : iconModalOpen.currentIcon
          }
          title="Choisir une icône"
        />
      </div>
    </section>
  );
}