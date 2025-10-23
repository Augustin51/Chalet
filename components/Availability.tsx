import React from 'react';
import { Calendar } from 'lucide-react';

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center space-x-1.5">
    <span className={`w-3 h-3 rounded-sm ${color}`}></span>
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

export default function Availability() {
  return (
    <section className="bg-[#fcfaf7] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-2">
            Disponibilités
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Consultez nos disponibilités en temps réel
          </p>
        </div>

        <div className="bg-[#f5f3ef] p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100 h-96 flex items-center justify-center">
          
          <div className="text-center space-y-4">
            <Calendar className="h-10 w-10 mx-auto text-[#467A5E]" strokeWidth={1.5} />

            <p className="text-lg font-medium text-gray-700">
              Calendrier interactif des disponibilités
            </p>

            <div className="flex justify-center space-x-6 pt-2">
              <LegendItem color="bg-green-500" label="Disponible" />
              <LegendItem color="bg-red-500" label="Réservé" />
              <LegendItem color="bg-gray-400" label="Non disponible" />
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}