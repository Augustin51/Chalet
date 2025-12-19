import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de réservation requis' },
        { status: 400 }
      );
    }

    await prisma.reservation.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Réservation supprimée'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
