import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { iconName } = await request.json();

    if (!iconName) {
      return NextResponse.json(
        { success: false, error: 'Le nom de l\'icône est requis' },
        { status: 400 }
      );
    }

    // Vérifier que le nom est valide (PascalCase, lettres uniquement)
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(iconName.trim())) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Le nom "${iconName}" doit être en PascalCase : première lettre majuscule, pas d'espaces, pas de tirets (ex: Home, MapPin, Clock3)` 
        },
        { status: 400 }
      );
    }

    const iconMapPath = join(process.cwd(), 'lib', 'iconMap.tsx');
    let content = readFileSync(iconMapPath, 'utf-8');

    // Vérifier si l'icône existe déjà (insensible à la casse)
    const importMatch = content.match(/import \{([^}]+)\} from "lucide-react";/);
    if (importMatch) {
      const existingIcons = importMatch[1]
        .split(',')
        .map(i => i.trim())
        .filter(i => i && i !== 'LucideIcon');
      
      const existingIconLower = existingIcons.find(
        icon => icon.toLowerCase() === iconName.toLowerCase()
      );
      
      if (existingIconLower) {
        return NextResponse.json(
          { success: false, error: `Cette icône existe déjà sous le nom "${existingIconLower}"` },
          { status: 400 }
        );
      }
    }

    // Extraire à nouveau la ligne d'import (déjà fait plus haut mais on refait pour clarté)
    const importMatch2 = content.match(/import \{([^}]+)\} from "lucide-react";/);
    if (!importMatch2) {
      return NextResponse.json(
        { success: false, error: 'Impossible de trouver l\'import lucide-react' },
        { status: 500 }
      );
    }

    const currentImports = importMatch2[1].trim();
    const newImports = `${currentImports}, ${iconName}`;
    
    // Remplacer l'import
    content = content.replace(
      /import \{([^}]+)\} from "lucide-react";/,
      `import { ${newImports} } from "lucide-react";`
    );


    // Ajouter l'icône dans l'objet iconMap (juste avant la dernière accolade)
    content = content.replace(
      /(export const iconMap: \{[^}]+\} = \{)([\s\S]*?)(\n\};)/,
      (match, start, body, end) => {
        // Vérifier si l'icône existe déjà dans le mapping
        if (body.includes(`${iconName}:`)) return match;
        // Ajouter l'icône à la fin du mapping
        return `${start}${body}  ${iconName}: ${iconName},${end}`;
      }
    );

    // Écrire le fichier
    writeFileSync(iconMapPath, content, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'icône:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
