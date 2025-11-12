import { LucideIcon } from "lucide-react";
import { iconMap, DefaultIcon } from "@/lib/iconMap";

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
}

export default function LocalFavorites({ dataContent, dataFavorites }: LocalFavoritesProps) {  
  if (!dataContent || !dataFavorites) {
    return <section className="bg-[#f5f3ef] py-16">Chargement...</section>;
  }
  return (
    <section className="bg-[#f5f3ef] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-3">
            {dataContent.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {dataContent.subtitle}
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
                <h3 className="text-xl font-semibold text-[#2c4b3a] mb-2">{favorite.title}</h3>
                <p className="text-base text-[#467A5E]">{favorite.details}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}