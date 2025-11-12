import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { iconMap, DefaultIcon } from "@/lib/iconMap"; 

interface FeatureFromDB {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

interface PageContent {
  title: string;
  subtitle: string;
}

interface FeaturesProps {
  dataContent: PageContent; 
  dataFeature: FeatureFromDB[];
}

export default function Features({ dataContent, dataFeature }: FeaturesProps) {
  if (!dataContent || !dataFeature) {
    return <section className="bg-[#efe9e0] py-16">Chargement...</section>;
  }

  return (
    <section className="bg-[#efe9e0] py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-900 mb-4">
          {dataContent.title}
        </h2>
        <p className="text-emerald-700/80 mb-12">
          {dataContent.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {dataFeature.map((f) => {
            const Icon = iconMap[f.iconName] || DefaultIcon;
            
            return (
              <Card key={f.id} className="rounded-2xl shadow-sm">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-emerald-700/40 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-emerald-700" aria-hidden />
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-900 mb-2">{f.title}</h3>
                  <p className="text-emerald-700/80">{f.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}