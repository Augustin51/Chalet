"use client";

import React from 'react';
import { Star } from 'lucide-react';
import { useAdmin } from "@/components/common/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";
import Loading from "@/components/common/Loading";

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
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor("avis", "Stats");

  if (!dataStats) {
    return <section className="bg-[#f5f3ef] py-12"><Loading /></section>;
  }

  return (
    <section className="bg-[#f5f3ef] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
          {dataStats.map((stat) => (
            <div 
              key={stat.id} 
              className="text-center p-4"
            >
              <p className="text-5xl sm:text-6xl font-bold text-[#467A5E] mb-2 leading-none">
                {isAdmin ? (
                  <input
                    type="text"
                    defaultValue={stat.main}
                    onBlur={(e) => handleUpdate(e, `stat_${stat.id}_main`)}
                    onKeyDown={(e) => handleUpdate(e, `stat_${stat.id}_main`)}
                    className="w-full text-center text-5xl sm:text-6xl font-bold text-[#467A5E] leading-none bg-transparent border border-transparent px-2 py-1 mb-2 focus:outline-none focus:border-[#467A5E]/30 focus:bg-white/5 rounded transition-colors"
                  />
                ) : (
                  stat.main
                )}
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
                {isAdmin ? (
                  <input
                    type="text"
                    defaultValue={stat.sub}
                    onBlur={(e) => handleUpdate(e, `stat_${stat.id}_sub`)}
                    onKeyDown={(e) => handleUpdate(e, `stat_${stat.id}_sub`)}
                    className="w-full text-center text-base text-gray-600 bg-transparent border border-transparent px-2 py-1 mt-2 focus:outline-none focus:border-gray-400/30 focus:bg-white/5 rounded transition-colors"
                  />
                ) : (
                  stat.sub
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}