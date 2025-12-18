import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔄 Migration ChaletIntro: fusion de p1, p2, p3 en content...');

    // Récupérer les valeurs existantes
    const p1 = await prisma.content.findUnique({
      where: { page_component_key: { page: 'chalet', component: 'ChaletIntro', key: 'p1' } },
    });
    const p2 = await prisma.content.findUnique({
      where: { page_component_key: { page: 'chalet', component: 'ChaletIntro', key: 'p2' } },
    });
    const p3 = await prisma.content.findUnique({
      where: { page_component_key: { page: 'chalet', component: 'ChaletIntro', key: 'p3' } },
    });

    // Fusionner les paragraphes avec des sauts de ligne doubles
    const mergedContent = [
      p1?.value || '',
      p2?.value || '',
      p3?.value || '',
    ]
      .filter(Boolean)
      .join('\n\n');

    console.log('📝 Contenu fusionné:', mergedContent);

    // Créer ou mettre à jour le nouveau champ content
    await prisma.content.upsert({
      where: {
        page_component_key: { page: 'chalet', component: 'ChaletIntro', key: 'content' },
      },
      update: {
        value: mergedContent,
      },
      create: {
        page: 'chalet',
        component: 'ChaletIntro',
        key: 'content',
        value: mergedContent,
      },
    });

    console.log('✅ Nouveau champ "content" créé avec succès');

    // Supprimer les anciens champs p1, p2, p3
    await prisma.content.deleteMany({
      where: {
        page: 'chalet',
        component: 'ChaletIntro',
        key: { in: ['p1', 'p2', 'p3'] },
      },
    });

    console.log('🗑️  Anciens champs p1, p2, p3 supprimés');
    console.log('✨ Migration terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
