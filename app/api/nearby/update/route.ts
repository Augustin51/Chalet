import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, field, value } = body;

    const allowed = ["time", "label", "color", "season"];
    if (!allowed.includes(field)) {
      return NextResponse.json({ success: false, error: "Field not allowed" }, { status: 400 });
    }

    const updated = await prisma.nearby.update({
      where: { id: Number(id) },
      data: { [field]: value },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Erreur API nearby update:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
