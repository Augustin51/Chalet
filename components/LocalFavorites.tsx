import { MapPin, UtensilsCrossed, LucideIcon } from "lucide-react";

export const favoritesData: FavoriteItem[] = [
  {
    icon: MapPin,
    title: "Belvédères & Points de vue",
    details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi cupiditate earum, quasi quos, dolorum quo minima",
  },
  {
    icon: UtensilsCrossed,
    title: "Gastronomie locale",
    details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi cupiditate earum, quasi quos, dolorum quo minima",
  },
  {
    icon: MapPin,
    title: "Villages de charme",
    details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi cupiditate earum, quasi quos, dolorum quo minima",
  },
];

interface FavoriteItem {
  icon: LucideIcon;
  title: string;
  details: string;
}

export default function LocalFavorites() {
  return (
    <section className="bg-[#f5f3ef] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* TITRE ET SOUS-TITRE */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-3">
            Nos coups de cœur locaux
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Les incontournables à découvrir absolument
          </p>
        </div>

        {/* GRILLE DES CARTES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {favoritesData.map((favorite) => {
            const Icon = favorite.icon;
            return (
              <div
                key={favorite.title}
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
