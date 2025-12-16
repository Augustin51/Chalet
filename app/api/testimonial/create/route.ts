import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, avatarUrl, date, stars, source, review } = body;

    // Validation
    if (!name || !review) {
      return NextResponse.json(
        { success: false, error: 'Le nom et l\'avis sont requis' },
        { status: 400 }
      );
    }

    // Créer le nouvel avis
    const testimonial = await prisma.testimonial.create({
      data: {
        name: name,
        avatarUrl: avatarUrl || '/images/avatar-default.jpg',
        date: date || new Date().toLocaleDateString('fr-FR'),
        stars: parseInt(stars) || 5,
        source: source || 'Google',
        review: review,
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
