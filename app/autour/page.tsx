"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import SeasonToggle from "@/components/SeasonToggle";
import ActivitiesSection from "@/components/ActivitiesSection";
import LocalFavorites from "@/components/LocalFavorites";

export default function About() {
  const [season, setSeason] = useState<"winter" | "summer">("winter");

  return (
    <>
      <PageHero
        title="Autour du Chalet"
        description="Un territoire riche en découvertes"
      />
      <SeasonToggle season={season} onChange={setSeason} />
      <ActivitiesSection season={season}  />
      <LocalFavorites />
    </>
  );
}
