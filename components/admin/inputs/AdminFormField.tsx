"use client";

import React from "react";

interface AdminFormFieldProps {
  fieldId: number;
  label: string;
  placeholder: string;
  onFieldUpdate: (
    e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
    fieldId: number,
    fieldType: "label" | "placeholder"
  ) => void;
  inputType?: "text" | "email" | "tel" | "date" | "select";
  inputName: string;
  children?: React.ReactNode; // Pour le contenu de l'input/select
  required?: boolean;
  showPlaceholderEdit?: boolean; // Certains champs n'ont pas besoin d'éditer le placeholder
}

/**
 * Composant pour gérer l'édition des champs de formulaire (label + placeholder)
 * Utilisé principalement dans ContactForm
 */
export default function AdminFormField({
  fieldId,
  label,
  placeholder,
  onFieldUpdate,
  inputType = "text",
  inputName,
  children,
  required = false,
  showPlaceholderEdit = true,
}: AdminFormFieldProps) {
  return (
    <div>
      <label htmlFor={inputName} className="text-sm font-medium text-gray-700 block mb-1">
        <input
          type="text"
          defaultValue={label}
          onBlur={(e) => onFieldUpdate(e, fieldId, "label")}
          onKeyDown={(e) => onFieldUpdate(e, fieldId, "label")}
          className="w-full text-sm font-medium text-gray-700 bg-transparent border border-transparent px-1 focus:outline-none focus:border-gray-700/30 focus:bg-gray-50 rounded transition-colors"
        />
      </label>
      
      {children || (
        <input
          type={inputType}
          id={inputName}
          name={inputName}
          placeholder={undefined}
          required={required}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#467A5E] focus:border-[#467A5E]"
        />
      )}

      {showPlaceholderEdit && (
        <input
          type="text"
          defaultValue={placeholder}
          onBlur={(e) => onFieldUpdate(e, fieldId, "placeholder")}
          onKeyDown={(e) => onFieldUpdate(e, fieldId, "placeholder")}
          placeholder="Placeholder"
          className="w-full mt-1 text-xs text-gray-500 bg-gray-50/50 border border-gray-200 px-2 py-1 focus:outline-none focus:border-[#467A5E]/30 rounded transition-colors"
        />
      )}
    </div>
  );
}
