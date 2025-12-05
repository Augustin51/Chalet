"use client";

import React from 'react';
import { Calendar } from 'lucide-react';
import { useAdmin } from '@/components/AdminProvider';
import { useContentEditor } from '@/utils/useContentEditor';

interface AvailabilityData {
  title: string;
  subtitle: string;
  placeholder_text: string;
}

export default function Availability({ dataContent, page = 'calendrier' }: { dataContent: AvailabilityData; page?: string }) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, 'Availability');

  if (!dataContent) {
    return <section className="bg-[#fcfaf7] py-16">Chargement...</section>;
  }
  return (
    <section className="bg-[#fcfaf7] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-2">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.title}
                onBlur={(e) => handleUpdate(e, 'title')}
                onKeyDown={(e) => handleUpdate(e, 'title')}
                className="w-full text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] bg-transparent border-transparent focus:border-[#2c4b3a]/30 focus:bg-white/5 p-2 rounded text-center transition-colors"
              />
            ) : (
              dataContent.title
            )}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.subtitle}
                onBlur={(e) => handleUpdate(e, 'subtitle')}
                onKeyDown={(e) => handleUpdate(e, 'subtitle')}
                className="w-full max-w-2xl mx-auto text-lg text-gray-600 bg-transparent border-transparent focus:border-gray-600/30 focus:bg-white/5 p-2 rounded text-center transition-colors"
              />
            ) : (
              dataContent.subtitle
            )}
          </p>
        </div>

        <div className="bg-[#f5f3ef] p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100 h-96 flex items-center justify-center">
          
          <div className="text-center space-y-4">
            <Calendar className="h-10 w-10 mx-auto text-[#467A5E]" strokeWidth={1.5} />

            <p className="text-lg font-medium text-gray-700">{dataContent.placeholder_text}</p>

            <div className="flex justify-center space-x-6 pt-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-500"></span>
                <span className="text-sm text-gray-700">Disponible</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-500"></span>
                <span className="text-sm text-gray-700">Réservé</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-gray-400"></span>
                <span className="text-sm text-gray-700">Non disponible</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}