import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { id, src } = await request.json();

    if (!id || !src) {
      return NextResponse.json({ success: false, error: 'ID et src requis' }, { status: 400 });
    }

    await prisma.galleryImage.update({
      where: { id: parseInt(id) },
      data: { src },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur update image:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
