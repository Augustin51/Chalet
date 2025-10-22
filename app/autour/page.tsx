"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import SeasonToggle from "@/components/SeasonToggle";

export default function About() {
  // État pour gérer la saison active
  const [season, setSeason] = useState<"hiver" | "ete">("hiver");

  return (
    <>
      <PageHero
        title="Autour du Chalet"
        description="Un territoire riche en découvertes"
      />

        <SeasonToggle season={season} onChange={setSeason} />

      {season === "hiver" ? (
        <p className="text-center text-emerald-900 text-lg">
          ❄️ Découvrez les pistes de ski, les randonnées en raquettes et les paysages enneigés.
        </p>
      ) : (
        <p className="text-center text-emerald-900 text-lg">
          🌿 Profitez des sentiers de randonnée, des lacs et des activités estivales.
        </p>
      )}
    </>
  );
}
