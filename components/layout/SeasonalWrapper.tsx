"use client";

import { useState } from "react";
import SeasonToggle from "@/components/layout/SeasonToggle";
import ActivitiesSection from "@/components/nearby/ActivitiesSection";

interface Activity { id: number; title: string; description: string; season: string; }
interface Nearby { id: number; time: string; label: string; color: string; season: string; }
interface SeasonalData {
  images: {
    winter: string; winter_alt: string;
    summer: string; summer_alt: string;
  },
  activities: {
    winter: Activity[]; summer: Activity[];
  },
  nearby: {
    winter: Nearby[]; summer: Nearby[];
  }
}

export default function SeasonalWrapper({ data }: { data: SeasonalData }) {
  const [season, setSeason] = useState<"winter" | "summer">("winter");

  const currentData = {
    imageSrc: season === 'winter' ? data.images.winter : data.images.summer,
    imageAlt: season === 'winter' ? data.images.winter_alt : data.images.summer_alt,
    activitiesList: season === 'winter' ? data.activities.winter : data.activities.summer,
    nearbyList: season === 'winter' ? data.nearby.winter : data.nearby.summer,
  }
  return (
    <>
      <SeasonToggle season={season} onChange={setSeason} />
      <ActivitiesSection 
        imageSrc={currentData.imageSrc}
        imageAlt={currentData.imageAlt}
        activitiesList={currentData.activitiesList}
        nearbyList={currentData.nearbyList}
        season={season}
        page="autour"
      />
    </>
  );
}