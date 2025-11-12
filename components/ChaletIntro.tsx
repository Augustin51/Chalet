import React from "react";

interface IntroData {
  title: string;
  p1: string;
  p2: string;
  p3: string;
}

export default function ChaletIntro({
  dataContent,
}: {
  dataContent: IntroData;
}) {
  if (!dataContent) {
    return <section className="py-16">Chargement...</section>;
  }
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2c4b3a] mb-8">
          {dataContent.title}
        </h2>

        <div className="text-gray-700 space-y-6 text-base leading-relaxed">
          <p>{dataContent.p1}</p>
          <p>{dataContent.p2}</p>
          <p>{dataContent.p3}</p>
        </div>
      </div>
    </section>
  );
}
