import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Idéalement, importez votre instance prisma singleton existante depuis @/lib/prisma
// Si vous n'en avez pas, ceci fonctionne pour le test :
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page, component, key, value } = body;

    // Vérification basique
    if (!page || !component || !key) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // UTILISATION DE PRISMA UPSERT
    const updatedContent = await prisma.content.upsert({
      where: {
        // Grâce au @@unique ajouté dans le schema, on peut cibler ainsi :
        page_component_key: {
          page,
          component,
          key,
        },
      },
      update: {
        value: value, // Si trouvé, on met à jour la valeur
      },
      create: {
        page,
        component,
        key,
        value: value || "", // Si pas trouvé, on crée la ligne
      },
    });

    return NextResponse.json({ success: true, data: updatedContent });
  } catch (err) {
    console.error("Erreur API Update:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}