// utils/updateContent.ts
"use client";

export async function updateContent(page: string, component: string, key: string, value: string) {
  try {
    const response = await fetch("/api/content/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Normaliser les séquences littérales "\\n" (backslash + n)
      // pour éviter d'enregistrer la chaîne "\\n" dans la DB lorsque
      // l'utilisateur colle du texte qui échappe les sauts de ligne.
      body: JSON.stringify({ page, component, key, value: (value || "").replace(/\\n/g, "\n") }),
    });

    // --- MODIFICATION DE DEBUG ---
    // Si la réponse n'est pas OK (200), on regarde le texte brut
    if (!response.ok) {
      const textError = await response.text(); // On lit le HTML
      console.error(`❌ Erreur API (${response.status}):`, textError);
      return { error: `Erreur ${response.status}` };
    }
    // -----------------------------

    const result = await response.json();
    console.log("✅ Sauvegardé :", key, value);
    return { data: result };

  } catch (error) {
    console.error("❌ Erreur réseau :", error);
    return { error };
  }
}