import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 👈 C'est ça le secret

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { page, component, key, value } = body;

    // Mise à jour via Prisma (Upsert = Update ou Insert)
    const updated = await prisma.content.upsert({
      where: {
        // C'est ici que la contrainte @@unique([page, component, key]) est utile
        page_component_key: {
          page,
          component,
          key,
        },
      },
      update: { value },
      create: { page, component, key, value },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}