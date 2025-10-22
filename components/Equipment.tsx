import React from "react";
import {
  Wifi,
  Tv,
  UtensilsCrossed,
  Snowflake,
  Mountain,
  ParkingCircle,
  PawPrint,
  Baby,
  LucideIcon,
} from "lucide-react";

interface EquipmentProps {
  icon: LucideIcon;
  label: string;
}

const equipments: EquipmentProps[] = [
  { icon: Wifi, label: "Wi-Fi gratuit" },
  { icon: Tv, label: "TV" },
  { icon: UtensilsCrossed, label: "Cuisine équipée" },
  { icon: Snowflake, label: "Cheminée" },
  { icon: ParkingCircle, label: "Garage privé" },
  { icon: Baby, label: "Équipements bébé" },
];

const EquipmentItem: React.FC<EquipmentProps> = ({ icon: Icon, label }) => (
  <div
    className="flex flex-col items-center justify-center p-4 sm:p-6 text-center 
              border border-gray-200 rounded-xl bg-white h-full 
              transition-all duration-300 hover:border-[#467A5E] hover:shadow-sm"
  >
    <Icon
      className="h-7 w-7 sm:h-8 sm:w-8 text-[#467A5E] mb-2" // Icone plus grande
      strokeWidth={2}
    />
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
);

export default function Equipment() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#2c4b3a] mb-8">
          Équipements & Services
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {equipments.map((equipment, index) => (
            <EquipmentItem
              key={index}
              icon={equipment.icon}
              label={equipment.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
