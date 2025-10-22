"use client";

import React from "react";
import { Snowflake, Sun } from "lucide-react";

interface SeasonToggleProps {
  season: "winter" | "summer";
  onChange: (season: "winter" | "summer") => void;
}

export default function SeasonToggle({ season, onChange }: SeasonToggleProps) {
  return (
    <div className="flex justify-center my-8 mb-8">
      <div className="bg-emerald-50 border border-emerald-100 rounded-full flex p-1">
        <button
          onClick={() => onChange("winter")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
            season === "winter"
              ? "bg-emerald-700 text-white"
              : "text-emerald-800 hover:bg-emerald-100"
          }`}
        >
          <Snowflake size={18} /> Hiver
        </button>
        <button
          onClick={() => onChange("summer")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
            season === "summer"
              ? "bg-emerald-700 text-white"
              : "text-emerald-800 hover:bg-emerald-100"
          }`}
        >
          <Sun size={18} /> Été
        </button>
      </div>
    </div>
  );
}
