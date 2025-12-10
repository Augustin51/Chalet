import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json({ success: false, error: 'Nom de fichier requis' }, { status: 400 });
    }

    // Vérifier si l'image est utilisée dans la base de données
    const [galleryImages, contentImages, testimonials] = await Promise.all([
      // Vérifier dans GalleryImage
      prisma.galleryImage.findMany({
        where: { src: fileName }
      }),
      // Vérifier dans Content (pour les images des différentes pages)
      prisma.content.findMany({
        where: { 
          value: fileName,
          key: { contains: 'image' }
        }
      }),
      // Vérifier dans Testimonial (avatars)
      prisma.testimonial.findMany({
        where: { avatarUrl: fileName }
      })
    ]);

    const totalUsages = galleryImages.length + contentImages.length + testimonials.length;

    if (totalUsages > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Cette image est utilisée ${totalUsages} fois dans la base de données. Veuillez d'abord la remplacer avant de la supprimer.`,
        usages: {
          gallery: galleryImages.length,
          content: contentImages.length,
          testimonials: testimonials.length
        }
      }, { status: 400 });
    }

    // Si l'image n'est pas utilisée, la supprimer
    const filePath = join(process.cwd(), 'public', 'images', fileName);
    await unlink(filePath);

    return NextResponse.json({ 
      success: true, 
      message: 'Image supprimée avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors de la suppression de l\'image' 
    }, { status: 500 });
  }
}
