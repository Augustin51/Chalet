import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const forceRename = formData.get('forceRename') === 'true';

    if (!file) {
      return NextResponse.json({ success: false, error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Le fichier doit être une image' }, { status: 400 });
    }

    // Chemin du dossier public/images
    const imagesDir = join(process.cwd(), 'public', 'images');
    
    // Créer le dossier s'il n'existe pas
    if (!existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true });
    }

    // Nettoyer le nom du fichier
    const cleanFileName = file.name.replace(/\s/g, '-');
    
    // Vérifier si le fichier existe déjà
    const existingFiles = await readdir(imagesDir);
    const fileExists = existingFiles.includes(cleanFileName);

    let finalFileName = cleanFileName;

    if (fileExists) {
      if (!forceRename) {
        // Retourner un message demandant confirmation
        return NextResponse.json({ 
          success: false, 
          error: 'duplicate',
          fileName: cleanFileName,
          message: `Une image nommée "${cleanFileName}" existe déjà.`
        }, { status: 409 });
      } else {
        // Trouver un nom disponible avec (1), (2), etc.
        const nameParts = cleanFileName.match(/^(.+?)(\.[^.]+)$/);
        if (!nameParts) {
          return NextResponse.json({ success: false, error: 'Nom de fichier invalide' }, { status: 400 });
        }
        
        const baseName = nameParts[1];
        const extension = nameParts[2];
        let counter = 1;
        
        while (existingFiles.includes(`${baseName}(${counter})${extension}`)) {
          counter++;
        }
        
        finalFileName = `${baseName}(${counter})${extension}`;
      }
    }

    // Convertir le fichier en buffer et sauvegarder
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(imagesDir, finalFileName);
    
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      fileName: finalFileName,
      message: 'Image uploadée avec succès'
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors de l\'upload' 
    }, { status: 500 });
  }
}
