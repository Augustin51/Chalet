"use client";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react"; // Assure-toi d'avoir lucide-react ou utilise des emojis

interface EditableFieldProps {
  value: string;
  page: string;
  component: string;
  fieldKey: string;
  className?: string;
  isTextarea?: boolean;
  as?: "h1" | "h2" | "p" | "span" | "div"; // Pour respecter la sémantique HTML
}

export default function EditableField({
  value: initialValue,
  page,
  component,
  fieldKey,
  className,
  isTextarea = false,
  as: Tag = "span", // Par défaut c'est un span, mais on peut changer
}: EditableFieldProps) {
  const isAdmin = useAdmin();
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Met à jour l'état local si la prop change (ex: rechargement des données)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  async function save(newValue: string) {
    // Si la valeur n'a pas changé, on ne fait rien pour économiser des appels API
    if (newValue === initialValue && status === 'idle') return;
    
    setStatus("saving");
    setValue(newValue);

    try {
      const res = await fetch("/api/content/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page,
          component,
          key: fieldKey,
          value: newValue,
        }),
      });

      if (res.ok) {
        setStatus("saved");
        // Remet le statut à idle après 2 secondes
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("error");
      }
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  // --- MODE VISITEUR (NON ADMIN) ---
  if (!isAdmin) {
    // On rend juste le texte dans la balise demandée
    return <Tag className={className}>{value}</Tag>;
  }

  // --- MODE ADMIN ---
  return (
    <div className="relative group w-full inline-block">
      {/* Indicateur de statut (petite icône flottante) */}
      <div className="absolute -top-3 -right-3 z-50">
        {status === "saving" && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
        {status === "saved" && <Check className="w-4 h-4 text-green-500" />}
        {status === "error" && <span className="text-red-500 text-xs">!</span>}
      </div>

      {isTextarea ? (
        <textarea
          className={`${className} bg-white/20 hover:bg-white/30 focus:bg-white/90 focus:text-black transition-all p-2 rounded border border-transparent focus:border-blue-500 outline-none resize-none min-h-[100px]`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => save(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={`${className} bg-white/20 hover:bg-white/30 focus:bg-white/90 focus:text-black transition-all p-2 rounded border border-transparent focus:border-blue-500 outline-none w-full`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => save(e.target.value)}
        />
      )}
    </div>
  );
}