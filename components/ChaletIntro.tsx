"use client";

import React from "react";
import { useAdmin } from "@/components/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";

interface IntroData {
  title: string;
  p1: string;
  p2: string;
  p3: string;
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
            <>
              <textarea
                defaultValue={dataContent.p1}
                onBlur={(e) => handleUpdate(e, "p1")}
                onKeyDown={(e) => handleUpdate(e, "p1")}
                className="w-full p-2 rounded bg-white/20"
                rows={3}
              />
              <textarea
                defaultValue={dataContent.p2}
                onBlur={(e) => handleUpdate(e, "p2")}
                onKeyDown={(e) => handleUpdate(e, "p2")}
                className="w-full p-2 rounded bg-white/20"
                rows={3}
              />
              <textarea
                defaultValue={dataContent.p3}
                onBlur={(e) => handleUpdate(e, "p3")}
                onKeyDown={(e) => handleUpdate(e, "p3")}
                className="w-full p-2 rounded bg-white/20"
                rows={3}
              />
            </>
          ) : (
            <>
              <p>{dataContent.p1}</p>
              <p>{dataContent.p2}</p>
              <p>{dataContent.p3}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
