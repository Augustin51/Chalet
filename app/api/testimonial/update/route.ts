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

    // Convertir la valeur selon le champ
    let finalValue: any = value;
    if (field === 'stars') {
      finalValue = parseInt(value);
    }

    // Mise à jour du témoignage
    const updated = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: { [field]: finalValue },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du témoignage:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
