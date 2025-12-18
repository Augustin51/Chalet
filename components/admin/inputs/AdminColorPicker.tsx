"use client";

import React from "react";
import AdminInput from "./AdminInput";

interface AdminColorPickerProps {
  color: string;
  legend: string;
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLegendUpdate: (e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => void;
  colorLabel?: string;
}

/**
 * Composant combiné : color picker + légende éditable
 * Utilisé principalement dans Availability pour les couleurs du calendrier
 */
export default function AdminColorPicker({
  color,
  legend,
  onColorChange,
  onLegendUpdate,
  colorLabel = "Couleur",
}: AdminColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 min-w-[80px]">{colorLabel}</label>
        <input
          type="color"
          value={color}
          onChange={onColorChange}
          className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Légende</label>
        <AdminInput
          value={legend}
          onUpdate={onLegendUpdate}
          className="w-full text-sm text-gray-700 bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-[#467A5E] transition-colors"
        />
      </div>
    </div>
  );
}
