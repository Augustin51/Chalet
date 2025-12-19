import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'id requis' }, { status: 400 });

    const deleted = await prisma.equipment.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Erreur suppression équipement:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
