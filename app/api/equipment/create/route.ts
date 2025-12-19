import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { label, iconName } = await request.json();

    if (!label || !iconName) {
      return NextResponse.json({ success: false, error: "Paramètres manquants" }, { status: 400 });
    }

    const created = await prisma.equipment.create({
      data: {
        label,
        iconName,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Erreur lors de la création de l'équipement:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
