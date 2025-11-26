"use client";

import { updateContent } from "./updateContent";

// On demande page et component dès l'initialisation du hook
export function useContentEditor(page: string, component: string) {

  const handleUpdate = async (
    e:
      | React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string
  ) => {
    // Si c'est un KeyboardEvent, on ne sauvegarde que sur Enter
    const isKeyboard = (e as React.KeyboardEvent).key !== undefined;

    if (isKeyboard) {
      const ke = e as React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>;
      // Ne sauvegarder que sur Enter SANS Shift (Shift+Enter doit insérer un saut de ligne)
      if (ke.key !== "Enter" || ke.shiftKey) return;
      ke.preventDefault();
    }

    // Pour FocusEvent (onBlur) ou Enter, on lit la valeur et on sauvegarde
    const newValue = (e.target as HTMLInputElement).value;
    await updateContent(page, component, key, newValue);

    // Si on vient d'un KeyboardEvent, retirer le focus
    if (isKeyboard) {
      (e.target as HTMLInputElement).blur();
    }
  };

  return { handleUpdate };
}