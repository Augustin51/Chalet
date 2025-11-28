import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, text } = body;

    const updated = await prisma.infoItem.update({
      where: { id: Number(id) },
      data: { text },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Erreur API infoitem update:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
