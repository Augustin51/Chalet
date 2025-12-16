import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate, chaletLeft, chaletRight } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'startDate et endDate sont requis' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Vérifier que la date de fin est après la date de début
    if (end < start) {
      return NextResponse.json(
        { success: false, error: 'La date de fin doit être après la date de début' },
        { status: 400 }
      );
    }

    // Vérifier les conflits avec les réservations existantes
    const conflictingReservations = await prisma.reservation.findMany({
      where: {
        OR: [
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: start } }
            ]
          }
        ]
      }
    });

    // Vérifier les conflits pour chaque chalet
    const conflicts = [];
    
    for (const existing of conflictingReservations) {
      if (chaletLeft && existing.chaletLeft) {
        conflicts.push(`Le chalet gauche est déjà réservé du ${new Date(existing.startDate).toLocaleDateString('fr-FR')} au ${new Date(existing.endDate).toLocaleDateString('fr-FR')}`);
      }
      if (chaletRight && existing.chaletRight) {
        conflicts.push(`Le chalet droit est déjà réservé du ${new Date(existing.startDate).toLocaleDateString('fr-FR')} au ${new Date(existing.endDate).toLocaleDateString('fr-FR')}`);
      }
    }

    if (conflicts.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Conflit de réservation',
          details: conflicts.join('. ')
        },
        { status: 409 }
      );
    }

    // Créer la réservation si pas de conflit
    const reservation = await prisma.reservation.create({
      data: {
        startDate: start,
        endDate: end,
        chaletLeft: chaletLeft || false,
        chaletRight: chaletRight || false
      }
    });

    return NextResponse.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
