import Image from "next/image";

interface Activity {
  id: number;
  title: string;
  description: string;
}
interface Nearby {
  id: number;
  time: string;
  label: string;
  color: string;
}

interface ActivitiesSectionProps {
  imageSrc: string;
  imageAlt: string;
  activitiesList: Activity[];
  nearbyList: Nearby[];
}

export default function ActivitiesSection({ imageSrc, imageAlt, activitiesList, nearbyList }: ActivitiesSectionProps) {
  return (
    <section className="bg-[#fdfaf5] py-12 px-6 rounded-xl">
      <div className="max-w-6xl mx-auto">
        <div className="relative w-full h-72 md:h-96 mb-8 overflow-hidden rounded-2xl shadow-sm">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {activitiesList.map((activity) => (
            <div
              key={activity.id}
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
          {nearbyList.map((item) => (
            <div key={item.id}>
              <p className={`text-2xl font-bold ${item.color} mb-1`}>{item.time}</p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}