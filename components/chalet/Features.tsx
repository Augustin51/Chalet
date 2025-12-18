"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { iconMap, DefaultIcon } from "@/lib/iconMap";
import { useAdmin } from "@/components/common/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

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

  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor("home", "Features");

  return (
    <section className="bg-[#efe9e0] py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="w-full max-w-4xl mx-auto text-4xl md:text-5xl font-extrabold text-emerald-900 mb-4 text-center">
          {isAdmin ? (
            <input
              type="text"
              defaultValue={dataContent.title}
              onBlur={(e) => handleUpdate(e, "title")}
              onKeyDown={(e) => handleUpdate(e, "title")}
              className="w-full max-w-4xl mx-auto text-center text-4xl md:text-5xl font-extrabold text-emerald-900 bg-transparent border border-transparent px-2 py-1 mb-4 focus:outline-none focus:border-emerald-900/30 focus:bg-white/10 rounded transition-colors"
            />
          ) : (
            dataContent.title
          )}
        </h2>
        <p className="text-emerald-700/80 mb-12 text-center max-w-3xl mx-auto">
          {isAdmin ? (
            <input
              type="text"
              defaultValue={dataContent.subtitle}
              onBlur={(e) => handleUpdate(e, "subtitle")}
              onKeyDown={(e) => handleUpdate(e, "subtitle")}
              className="w-full max-w-3xl mx-auto text-center text-emerald-700/80 bg-transparent border border-transparent px-2 py-1 mb-12 focus:outline-none focus:border-emerald-700/30 focus:bg-white/10 rounded transition-colors"
            />
          ) : (
            dataContent.subtitle
          )}
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
                  {isAdmin ? (
                    <>
                      <input
                        type="text"
                        defaultValue={f.title}
                        onBlur={(e) => handleUpdate(e, `feature_${f.id}_title`)}
                        onKeyDown={(e) =>
                          handleUpdate(e, `feature_${f.id}_title`)
                        }
                        className="w-full text-center text-xl font-semibold text-emerald-900 mb-2 bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-emerald-900/30 focus:bg-white/10 rounded transition-colors"
                      />
                      <input
                        type="text"
                        defaultValue={f.description}
                        onBlur={(e) =>
                          handleUpdate(e, `feature_${f.id}_description`)
                        }
                        onKeyDown={(e) =>
                          handleUpdate(e, `feature_${f.id}_description`)
                        }
                        className="w-full text-center text-emerald-700/80 bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-emerald-700/30 focus:bg-white/10 rounded transition-colors"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-emerald-900 mb-2 text-center">
                        {f.title}
                      </h3>
                      <p className="text-emerald-700/80 text-center">
                        {f.description}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
