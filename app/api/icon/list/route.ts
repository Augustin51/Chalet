import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const iconMapPath = join(process.cwd(), 'lib', 'iconMap.tsx');
    const content = readFileSync(iconMapPath, 'utf-8');
    // Extraire les icônes importées
    const importMatch = content.match(/import \{([^}]+)\} from "lucide-react";/);
    let icons: string[] = [];
    if (importMatch) {
      icons = importMatch[1]
        .split(',')
        .map(i => i.trim())
        .filter(i => i && i !== 'LucideIcon');
    }
    return NextResponse.json({ success: true, icons });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
