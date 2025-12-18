"use client";

import React from "react";

interface AdminInputProps {
  value: string;
  onUpdate: (e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  type?: "text" | "number" | "email" | "tel" | "url";
  placeholder?: string;
}

/**
 * Composant input générique pour l'édition admin
 * Gère automatiquement onBlur, onKeyDown et preventDefault sur Enter
 */
export default function AdminInput({
  value,
  onUpdate,
  className = "w-full text-sm font-medium text-gray-700 bg-transparent border border-transparent px-1 focus:outline-none focus:border-gray-700/30 focus:bg-gray-50 rounded transition-colors",
  type = "text",
  placeholder,
}: AdminInputProps) {
  return (
    <input
      type={type}
      defaultValue={value}
      onBlur={onUpdate}
      onKeyDown={onUpdate}
      placeholder={placeholder}
      className={className}
    />
  );
}
