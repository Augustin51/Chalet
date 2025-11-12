import React from 'react';
import { Star } from 'lucide-react';

interface StatItem {
  id: number;
  main: string;
  sub: string;
  showStars: boolean; 
}

interface StatsProps {
  dataStats: StatItem[];
}

export default function Stats({ dataStats }: StatsProps) {
  if (!dataStats) {
    return <section className="bg-[#f5f3ef] py-12">Chargement...</section>;
  }
  return (
    <section className="bg-[#f5f3ef] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
          {dataStats.map((stat) => (
            <div key={stat.id} className="text-center p-4">
              
              <p className="text-5xl sm:text-6xl font-bold text-[#467A5E] mb-2 leading-none">
                {stat.main}
              </p>
              
              {stat.showStars && (
                <div className="flex justify-center my-1 space-x-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star 
                      key={index} 
                      className="h-6 w-6 text-yellow-500 fill-yellow-500" 
                      strokeWidth={1}
                    />
                  ))}
                </div>
              )}
              
              <p className="text-base text-gray-600 mt-2">
                {stat.sub}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}