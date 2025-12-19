import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { featureId, iconName } = await request.json();

    if (!featureId || !iconName) {
      return NextResponse.json(
        { success: false, error: 'featureId et iconName sont requis' },
        { status: 400 }
      );
    }

    // Mettre à jour l'icône dans la table Feature
    await prisma.feature.update({
      where: { id: Number(featureId) },
      data: { iconName },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'icône:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
