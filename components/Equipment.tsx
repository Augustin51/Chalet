import React from "react";
import { iconMap, DefaultIcon } from "@/lib/iconMap";

interface EquipmentData {
  title: string;
}

interface EquipmentItem {
  id: number;
  label: string;
  iconName: string;
}

interface EquipmentProps {
  dataContent: EquipmentData;
  dataEquipment: EquipmentItem[];
}

export default function Equipment({ dataContent, dataEquipment }: EquipmentProps) {
  if (!dataContent || !dataEquipment) {
    return <section className="bg-white py-16">Chargement...</section>;
  }
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#2c4b3a] mb-8">
          {dataContent.title}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {dataEquipment.map((equipment) => {
            const Icon = iconMap[equipment.iconName] || DefaultIcon;
            return (
              <div
                key={equipment.id}
                className="flex flex-col items-center justify-center p-4 sm:p-6 text-center 
                         border border-gray-200 rounded-xl bg-white h-full 
                         transition-all duration-300 hover:border-[#467A5E] hover:shadow-sm"
              >
                <Icon
                  className="h-7 w-7 sm:h-8 sm:w-8 text-[#467A5E] mb-2"
                  strokeWidth={2}
                />
                <span className="text-sm font-medium text-gray-700">{equipment.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}