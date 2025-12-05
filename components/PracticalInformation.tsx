"use client";

import React from 'react';
import { useAdmin } from "@/components/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

interface PracticalInfoData {
  main_title: string;
  card_access_title: string;
  card_access_content: string;
  card_rules_title: string;
  card_rules_content: string;
  location_title: string;
  location_map_src: string;
}

export default function PracticalInformation({ dataContent, page = "chalet" }: { dataContent: PracticalInfoData; page?: string }) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, "PracticalInformation");

  if (!dataContent) {
    return <section className="bg-white py-16">Chargement...</section>;
  }

  // Certains contenus peuvent contenir la séquence littérale "\\n" (backslash + n)
  // — par ex. si on a copié-collé depuis une source qui échappe les nouvelles lignes.
  // On normalise en remplaçant ces séquences par de vrais sauts de ligne avant l'affichage.
  const normalizeNewlines = (s: string | undefined) => (s || "").replace(/\\n/g, "\n");

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-12">
          {isAdmin ? (
            <input
              type="text"
              defaultValue={dataContent.main_title}
              onBlur={(e) => handleUpdate(e, "main_title")}
              onKeyDown={(e) => handleUpdate(e, "main_title")}
              className="w-full text-4xl sm:text-5xl font-serif font-bold bg-white/20 p-2 rounded"
            />
          ) : (
            dataContent.main_title
          )}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#2c4b3a] mb-4">
              {isAdmin ? (
                <input
                  type="text"
                  defaultValue={dataContent.card_access_title}
                  onBlur={(e) => handleUpdate(e, "card_access_title")}
                  onKeyDown={(e) => handleUpdate(e, "card_access_title")}
                  className="w-full text-xl sm:text-2xl font-semibold bg-white/20 p-1 rounded"
                />
              ) : (
                dataContent.card_access_title
              )}
            </h3>
            <div className="text-gray-700 text-base leading-relaxed">
              {isAdmin ? (
                <textarea
                  defaultValue={dataContent.card_access_content}
                  onBlur={(e) => handleUpdate(e, "card_access_content")}
                  onKeyDown={(e) => handleUpdate(e, "card_access_content")}
                  className="w-full p-2 rounded bg-white/20"
                  rows={4}
                />
              ) : (
                <p>{normalizeNewlines(dataContent.card_access_content)}</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#2c4b3a] mb-4">
              {isAdmin ? (
                <input
                  type="text"
                  defaultValue={dataContent.card_rules_title}
                  onBlur={(e) => handleUpdate(e, "card_rules_title")}
                  onKeyDown={(e) => handleUpdate(e, "card_rules_title")}
                  className="w-full text-xl sm:text-2xl font-semibold bg-white/20 p-1 rounded"
                />
              ) : (
                dataContent.card_rules_title
              )}
            </h3>
            <div className="text-gray-700 text-base leading-relaxed">
              {isAdmin ? (
                <textarea
                  defaultValue={dataContent.card_rules_content}
                  onBlur={(e) => handleUpdate(e, "card_rules_content")}
                  onKeyDown={(e) => handleUpdate(e, "card_rules_content")}
                  className="w-full p-2 rounded bg-white/20"
                  rows={4}
                />
              ) : (
                <ul className="list-none space-y-2 pl-0">
                  {normalizeNewlines(dataContent.card_rules_content)
                    .split("\n")
                    .map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              )}
            </div>
          </div>
          
        </div>

        <div className="mb-8">
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#2c4b3a] mb-8">
            {isAdmin ? (
              <input
                type="text"
                defaultValue={dataContent.location_title}
                onBlur={(e) => handleUpdate(e, "location_title")}
                onKeyDown={(e) => handleUpdate(e, "location_title")}
                className="w-full text-3xl sm:text-4xl font-serif font-bold bg-white/20 p-2 rounded"
              />
            ) : (
              dataContent.location_title
            )}
          </h3>

          <div className="rounded-xl overflow-hidden shadow-inner border border-gray-200 h-150">
            <iframe
              src={dataContent.location_map_src}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        
      </div>
    </section>
  );
}