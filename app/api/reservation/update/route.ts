import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { id, startDate, endDate, chaletLeft, chaletRight } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de réservation requis' },
        { status: 400 }
      );
    }

    // Récupérer la réservation actuelle
    const currentReservation = await prisma.reservation.findUnique({
      where: { id }
    });

    if (!currentReservation) {
      return NextResponse.json(
        { success: false, error: 'Réservation introuvable' },
        { status: 404 }
      );
    }

    // Préparer les nouvelles données
    const start = startDate ? new Date(startDate) : currentReservation.startDate;
    const end = endDate ? new Date(endDate) : currentReservation.endDate;
    const left = chaletLeft !== undefined ? chaletLeft : currentReservation.chaletLeft;
    const right = chaletRight !== undefined ? chaletRight : currentReservation.chaletRight;

    // Vérifier que la date de fin est après la date de début
    if (end < start) {
      return NextResponse.json(
        { success: false, error: 'La date de fin doit être après la date de début' },
        { status: 400 }
      );
    }

    // Vérifier les conflits avec les autres réservations (exclure la réservation actuelle)
    const conflictingReservations = await prisma.reservation.findMany({
      where: {
        AND: [
          { id: { not: id } }, // Exclure la réservation en cours de modification
          {
            OR: [
              {
                AND: [
                  { startDate: { lte: end } },
                  { endDate: { gte: start } }
                ]
              }
            ]
          }
        ]
      }
    });

    // Vérifier les conflits pour chaque chalet
    const conflicts = [];
    
    for (const existing of conflictingReservations) {
      if (left && existing.chaletLeft) {
        conflicts.push(`Le chalet gauche est déjà réservé du ${new Date(existing.startDate).toLocaleDateString('fr-FR')} au ${new Date(existing.endDate).toLocaleDateString('fr-FR')}`);
      }
      if (right && existing.chaletRight) {
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

    // Mettre à jour la réservation si pas de conflit
    const data: any = {};
    if (startDate !== undefined) data.startDate = start;
    if (endDate !== undefined) data.endDate = end;
    if (chaletLeft !== undefined) data.chaletLeft = left;
    if (chaletRight !== undefined) data.chaletRight = right;

    const reservation = await prisma.reservation.update({
      where: { id },
      data
    });

    return NextResponse.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
