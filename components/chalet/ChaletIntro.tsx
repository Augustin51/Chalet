"use client";

import React from "react";
import { useAdmin } from "@/components/common/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

interface IntroData {
  title: string;
  content: string;
}

export default function ChaletIntro({
  dataContent,
  page = "chalet",
}: {
  dataContent: IntroData;
  page?: string;
}) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, "ChaletIntro");

  if (!dataContent) {
    return <section className="py-16">Chargement...</section>;
  }
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-8">
          {isAdmin ? (
            <input
              type="text"
              defaultValue={dataContent.title}
              onBlur={(e) => handleUpdate(e, "title")}
              onKeyDown={(e) => handleUpdate(e, "title")}
              className="w-full text-4xl sm:text-5xl font-serif font-bold bg-white/20 p-2 rounded"
            />
          ) : (
            dataContent.title
          )}
        </h2>

        <div className="text-gray-700 space-y-6 text-base leading-relaxed">
          {isAdmin ? (
            <textarea
              defaultValue={dataContent.content}
              onBlur={(e) => handleUpdate(e, "content")}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  return; // Permettre Enter pour nouvelle ligne
                }
                handleUpdate(e, "content");
              }}
              className="w-full p-2 rounded bg-white/20 resize-none"
              rows={10}
            />
          ) : (
            <>
              {dataContent.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
