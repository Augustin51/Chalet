"use client";

import React from "react";

interface AdminTextareaProps {
  value: string;
  onUpdate: (e: React.FocusEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  placeholder?: string;
}

/**
 * Composant textarea générique pour l'édition admin
 * Gère automatiquement onBlur, onKeyDown et preventDefault sur Enter
 */
export default function AdminTextarea({
  value,
  onUpdate,
  className = "w-full text-sm text-gray-700 bg-transparent border border-transparent px-2 py-1 focus:outline-none focus:border-gray-700/30 focus:bg-gray-50 rounded transition-colors resize-none",
  rows = 3,
  placeholder,
}: AdminTextareaProps) {
  return (
    <textarea
      defaultValue={value}
      onBlur={onUpdate}
      onKeyDown={onUpdate}
      placeholder={placeholder}
      rows={rows}
      className={className}
    />
  );
}
