import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { iconName } = await request.json();

    if (!iconName) {
      return NextResponse.json(
        { success: false, error: 'Le nom de l\'icône est requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'icône est utilisée dans les features
    const usedInFeatures = await prisma.feature.findFirst({
      where: { iconName },
    });

    if (usedInFeatures) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cette icône est utilisée dans une feature ("${usedInFeatures.title}"). Veuillez d'abord changer l'icône de cette feature.` 
        },
        { status: 400 }
      );
    }

    // Vérifier si l'icône est utilisée dans les équipements
    const usedInEquipment = await prisma.equipment.findFirst({
      where: { iconName },
    });

    if (usedInEquipment) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cette icône est utilisée dans un équipement ("${usedInEquipment.label}"). Veuillez d'abord changer l'icône de cet équipement.` 
        },
        { status: 400 }
      );
    }

    // Vérifier si l'icône est utilisée dans les informations de contact
    const usedInContactInfo = await prisma.contactInfo.findFirst({
      where: { iconName },
    });

    if (usedInContactInfo) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cette icône est utilisée dans les informations de contact ("${usedInContactInfo.title}"). Veuillez d'abord changer cette icône.` 
        },
        { status: 400 }
      );
    }

    // Vérifier si l'icône est utilisée dans les favoris locaux
    const usedInFavorites = await prisma.favorite.findFirst({
      where: { iconName },
    });

    if (usedInFavorites) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cette icône est utilisée dans les favoris ("${usedInFavorites.title}"). Veuillez d'abord changer l'icône de ce favori.` 
        },
        { status: 400 }
      );
    }

    // Lire le fichier iconMap.tsx
    const iconMapPath = join(process.cwd(), 'lib', 'iconMap.tsx');
    let content = readFileSync(iconMapPath, 'utf-8');

    // Vérifier que l'icône existe
    if (!content.includes(`${iconName}: ${iconName}`)) {
      return NextResponse.json(
        { success: false, error: 'Cette icône n\'existe pas dans iconMap' },
        { status: 404 }
      );
    }

    // Empêcher la suppression des icônes essentielles
    if (iconName === 'Default' || iconName === 'Star') {
      return NextResponse.json(
        { success: false, error: 'Impossible de supprimer cette icône car elle est utilisée comme icône par défaut' },
        { status: 400 }
      );
    }

    // Extraire la ligne d'import
    const importMatch = content.match(/import \{([^}]+)\} from "lucide-react";/);
    if (importMatch) {
      const imports = importMatch[1]
        .split(',')
        .map(i => i.trim())
        .filter(i => i && i !== iconName);
      
      content = content.replace(
        /import \{[^}]+\} from "lucide-react";/,
        `import { ${imports.join(', ')} } from "lucide-react";`
      );
    }

    // Supprimer de l'objet iconMap (plusieurs patterns possibles)
    // Pattern 1: avec saut de ligne après
    content = content.replace(new RegExp(`\\s*${iconName}:\\s*${iconName},\\n`, 'g'), '');
    // Pattern 2: sans saut de ligne (dernière entrée avant Default)
    content = content.replace(new RegExp(`\\s*${iconName}:\\s*${iconName},\\s*`, 'g'), '');

    // Écrire le fichier
    writeFileSync(iconMapPath, content, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'icône:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
