'use client';

import React from 'react';
import AdminInput from './AdminInput';

interface AdminLinkEditorProps {
  buttonText: string;
  buttonLink: string;
  onButtonTextUpdate: (e: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => void;
  onButtonLinkUpdate: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  textLabel?: string;
  linkLabel?: string;
  buttonClassName?: string;
}

const ROUTES = [
  { value: '/', label: 'Accueil' },
  { value: '/chalet', label: 'Le Chalet' },
  { value: '/calendrier', label: 'Calendrier & Tarifs' },
  { value: '/contact', label: 'Contact' },
  { value: '/avis', label: 'Avis' },
  { value: '/autour', label: 'Autour du Chalet' },
];

export default function AdminLinkEditor({
  buttonText,
  buttonLink,
  onButtonTextUpdate,
  onButtonLinkUpdate,
  textLabel = 'Texte du bouton',
  linkLabel = 'Lien du bouton',
  buttonClassName = '',
}: AdminLinkEditorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="text"
        defaultValue={buttonText}
        onBlur={onButtonTextUpdate}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onButtonTextUpdate(e);
          }
        }}
        className={buttonClassName || "w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"}
        placeholder="Texte du bouton"
      />
      
      <select
        defaultValue={buttonLink}
        onChange={onButtonLinkUpdate}
        className="px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
      >
        {ROUTES.map((route) => (
          <option key={route.value} value={route.value} className="bg-white text-gray-900">
            {route.label}
          </option>
        ))}
      </select>
    </div>
  );
}
