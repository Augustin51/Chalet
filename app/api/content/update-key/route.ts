import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { page, component, key, value } = await request.json();

    if (!page || !component || !key || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Mettre à jour ou créer l'entrée
    const content = await prisma.content.upsert({
      where: {
        page_component_key: {
          page,
          component,
          key
        }
      },
      update: {
        value
      },
      create: {
        page,
        component,
        key,
        value
      }
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
