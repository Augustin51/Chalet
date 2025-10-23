import React from 'react';
import Link from 'next/link';

const importantInfo = [
  "Location à la semaine (WE hors periode scolaire)",
  "Arrivée le samedi à partir de 16h",
  "Départ le samedi avant 10h",
  "Draps et linge non fournis",
  "Ménage de fin de séjour en option (80€)",
  "Caution de 600€ demandée",
];

export default function ImportantInfo() {
  return (
    <div className="container mx-auto my-9 max-w-4xl px-4 sm:px-6 lg:px-8">
      
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="flex items-start mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 mt-1 text-[#467A5E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-semibold text-[#2c4b3a]">
            Informations importantes
          </h3>
        </div>

        <ul className="list-disc ml-6 space-y-2 text-gray-700 text-base mb-8">
          {importantInfo.map((item, index) => (
            <li key={index} className="marker:text-[#467A5E]">{item}</li>
          ))}
        </ul>
        
        <div className="border-t border-gray-200 pt-6 flex flex-col items-center">
          
          <p className="text-sm text-gray-500 mb-4 text-center">
            Réservation possible également sur Abritel et Airbnb
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/contact" 
              className="px-6 py-2 border border-[#467A5E] bg-[#467A5E] text-white rounded-full hover:bg-[#346048] transition-colors text-sm font-medium text-center"
            >
              Nous contacter
            </Link>
            
            <Link 
              href="#"
              className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-full hover:bg-gray-50 transition-colors text-sm font-medium text-center"
            >
              Voir sur Abritel
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}