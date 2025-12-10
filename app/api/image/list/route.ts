import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const imagesDir = join(process.cwd(), 'public', 'images');
    
    // Vérifier si le dossier existe
    if (!existsSync(imagesDir)) {
      return NextResponse.json({ success: true, images: [] });
    }

    // Lire tous les fichiers du dossier
    const files = await readdir(imagesDir);
    
    // Filtrer uniquement les images
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const images = files.filter(file => 
      imageExtensions.some(ext => file.toLowerCase().endsWith(ext))
    );

    return NextResponse.json({ 
      success: true, 
      images: images.sort() 
    });

  } catch (error) {
    console.error('Erreur lecture images:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors de la lecture des images' 
    }, { status: 500 });
  }
}
