import { Euro } from "lucide-react";

export const pricingTiers = [
  {
    title: "Basse saison",
    period: "Avril - Mai & Octobre - Novembre",
    price: "850€",
    description: "Tarif semaine hors vacances scolaires",
  },
  {
    title: "Moyenne saison",
    period: "Juin - Septembre",
    price: "1150€",
    description: "Tarif semaine, idéal pour randonnées estivales",
  },
  {
    title: "Haute saison",
    period: "Décembre - Mars & Vacances scolaires",
    price: "1450€",
    description: "Tarif semaine, période ski et fêtes de fin d'année",
  },
];

export default function Price() {
  return (
    <section className="bg-[#f5f3ef] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-3">
            Nos tarifs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des prix transparents selon la saison
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {pricingTiers.map((tier) => (
            <div
              key={tier.title}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col justify-between transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 p-2 inline-block rounded-full bg-green-50 text-green-700">
                  <Euro className="h-6 w-6" strokeWidth={2.5} />
                </div>

                <h3 className="text-xl font-semibold text-[#2c4b3a] mb-1">
                  {tier.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{tier.period}</p>

                <p className="text-4xl font-bold text-[#467A5E] mb-4">
                  {tier.price}
                </p>

                <p className="text-sm text-gray-600">{tier.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
