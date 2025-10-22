import Image from "next/image";

export const activitiesData = {
  winter: {
    image: "/images/placeholder.png",
    alt: "Paysage enneigé avec skieurs",
    activities: [
      { title: "Ski alpin", description: "Station de ski à 5 minutes avec 200 km de pistes" },
      { title: "Ski de fond", description: "50 km de pistes de fond dans la vallée" },
      { title: "Raquettes", description: "Sentiers balisés au départ du chalet" },
      { title: "Luge", description: "Piste de luge éclairée en soirée" },
    ],
    nearby: [
      { time: "5 min", label: "Station de ski", color: "text-emerald-700" },
      { time: "10 min", label: "Centre-ville", color: "text-green-700" },
      { time: "15 min", label: "Lac de montagne", color: "text-amber-800" },
    ],
  },
  summer: {
    image: "/images/placeholder.png",
    alt: "Paysage de montagne en été",
    activities: [
      { title: "Randonnée", description: "Plus de 100 sentiers de tous niveaux" },
      { title: "VTT", description: "Circuits VTT et location sur place" },
      { title: "Escalade", description: "Sites d’escalade naturels et via ferrata" },
      { title: "Lac et baignade", description: "Lac de montagne à 15 minutes" },
    ],
    nearby: [
      { time: "5 min", label: "Station de ski", color: "text-emerald-700" },
      { time: "10 min", label: "Centre-ville", color: "text-green-700" },
      { time: "15 min", label: "Lac de montagne", color: "text-amber-800" },
    ],
  },
};

type Season = "winter" | "summer";

interface ActivitiesSectionProps {
  season: Season;
}

export default function ActivitiesSection({ season }: ActivitiesSectionProps) {
  const { image, alt, activities, nearby } = activitiesData[season];

  return (
    <section className="bg-[#fdfaf5] py-12 px-6 rounded-xl">
      <div className="max-w-6xl mx-auto">
        <div className="relative w-full h-72 md:h-96 mb-8 overflow-hidden rounded-2xl shadow-sm">
          <Image src={image} alt={alt} fill className="object-cover" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {activities.map((activity) => (
            <div
              key={activity.title}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-left"
            >
              <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                {activity.title}
              </h3>
              <p className="text-emerald-700/80 text-sm">
                {activity.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex justify-around text-center shadow-sm">
          {nearby.map((item) => (
            <div key={item.label}>
              <p className={`text-2xl font-bold ${item.color} mb-1`}>{item.time}</p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
