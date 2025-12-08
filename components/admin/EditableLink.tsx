'use client';

import { useEffect, useState } from 'react';

interface EditableLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onUpdate: (newHref: string) => Promise<void>;
}

const AVAILABLE_ROUTES = [
  { value: '/', label: 'Accueil' },
  { value: '/chalet', label: 'Le Chalet' },
  { value: '/autour', label: 'Autour du Chalet' },
  { value: '/calendrier', label: 'Calendrier & Tarifs' },
  { value: '/avis', label: 'Avis' },
  { value: '/contact', label: 'Contact' },
  { value: '/connexion', label: 'Connexion' },
  { value: '#', label: '#' },
];

export default function EditableLink({ href, children, className = '', onUpdate }: EditableLinkProps) {
  const [selectedRoute, setSelectedRoute] = useState(href);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedRoute(href);
  }, [href]);

  const handleRouteChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoute = e.target.value;
    setSelectedRoute(newRoute);
    setIsUpdating(true);
    
    try {
      await onUpdate(newRoute);
    } catch (error) {
      console.error('Failed to update link:', error);
      setSelectedRoute(href);
    } finally {
      setIsUpdating(false);
    }
  };

    return (
      <div className="inline-flex flex-col gap-2 w-full">
        <select
          value={selectedRoute}
          onChange={handleRouteChange}
          disabled={isUpdating}
          className={`${className} ${isUpdating ? 'opacity-50' : ''}`}
        >
          {AVAILABLE_ROUTES.map((route) => (
            <option key={route.value} value={route.value} className="bg-gray-800 text-white">
              {route.label}
            </option>
          ))}
        </select>
      </div>
    );
}
