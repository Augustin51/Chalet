import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id, field, value } = await request.json();

    if (!id || !field || value === undefined) {
      return NextResponse.json(
        { success: false, error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    // Mise à jour du champ de formulaire
    const updated = await prisma.formField.update({
      where: { id: parseInt(id) },
      data: { [field]: value },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du champ de formulaire:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
