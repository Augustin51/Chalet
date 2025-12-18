import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { src, alt } = await request.json();

    if (!src) {
      return NextResponse.json({ success: false, error: 'Source de l\'image requise' }, { status: 400 });
    }

    // Créer une nouvelle image de galerie
    const newImage = await prisma.galleryImage.create({
      data: {
        src,
        alt: alt || 'Image de la galerie',
      },
    });

    return NextResponse.json({ success: true, image: newImage }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'image:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
