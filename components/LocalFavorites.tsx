"use client";

import { LucideIcon } from "lucide-react";
import { iconMap, DefaultIcon } from "@/lib/iconMap";
import { useAdmin } from "@/components/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

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
    return <section className="bg-[#f5f3ef] py-16">Chargement...</section>;
  }

  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, "LocalFavorites");

  return (
    <section className="bg-[#f5f3ef] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-3">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.title}
                onBlur={(e) => handleUpdate(e, "title")}
                onKeyDown={(e) => handleUpdate(e, "title")}
                className="w-full text-4xl sm:text-5xl font-serif font-bold bg-white/20 p-2 rounded"
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
                className="w-full p-2 rounded bg-white/20"
                rows={2}
              />
            ) : (
              dataContent.subtitle
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {dataFavorites.map((favorite) => {
            const Icon = iconMap[favorite.iconName] || DefaultIcon;
            return (
              <div
                key={favorite.id}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-lg border border-gray-100 h-full"
              >
                <div className="mb-4">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[#467A5E]" strokeWidth={2} />
                </div>
                {isAdmin ? (
                  <>
                    <input
                      type="text"
                      defaultValue={favorite.title}
                      onBlur={(e) => handleUpdate(e, `favorite_${favorite.id}_title`)}
                      onKeyDown={(e) => handleUpdate(e, `favorite_${favorite.id}_title`)}
                      className="text-xl font-semibold text-[#2c4b3a] mb-2 bg-white/20 p-1 rounded w-full"
                    />
                    <textarea
                      defaultValue={favorite.details}
                      onBlur={(e) => handleUpdate(e, `favorite_${favorite.id}_details`)}
                      onKeyDown={(e) => handleUpdate(e, `favorite_${favorite.id}_details`)}
                      className="text-base text-[#467A5E] w-full p-1 rounded bg-white/20"
                      rows={3}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-[#2c4b3a] mb-2">{favorite.title}</h3>
                    <p className="text-base text-[#467A5E]">{favorite.details}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}