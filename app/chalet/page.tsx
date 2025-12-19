import ChaletIntro from "@/components/chalet/ChaletIntro";
import Equipment from "@/components/chalet/Equipment";
import Gallery from "@/components/common/Gallery";
import PageHero from "@/components/shared/PageHero";
import PracticalInformation from "@/components/chalet/PracticalInformation";
import { prisma } from "@/lib/prisma";

export default async function ChaletPage() {
  const chaletContentData = await prisma.content.findMany({
    where: { page: "chalet" }
  });

  const sharedGalleryContentData = await prisma.content.findMany({
    where: {
      page: "home",
      component: "Gallery"
    }
  });

  const equipmentData = await prisma.equipment.findMany();
  const galleryData = await prisma.galleryImage.findMany();

  // Transformation des données Chalet
  const chaletContent = chaletContentData?.reduce((acc: any, item: any) => {
    if (!acc[item.component]) acc[item.component] = {};
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as any);

  // Transformation pour le contenu partagé de la galerie
  const sharedGalleryContentTemp = sharedGalleryContentData?.reduce(
    (acc: any, item: any) => {
      if (!acc[item.component]) acc[item.component] = {};
      acc[item.component][item.key] = item.value;
      return acc;
    },
    {} as any
  );
  const sharedGalleryContent = sharedGalleryContentTemp?.Gallery || {};

  const equipment = equipmentData || [];
  const gallery = galleryData || [];

  const galleryContentForChalet = {
    ...sharedGalleryContent,
    description:
      chaletContent?.Gallery?.description || sharedGalleryContent.description,
  };

  return (
    <>
      <PageHero 
        dataContent={chaletContent?.PageHero}
        page="chalet"
      />
      <ChaletIntro 
        dataContent={chaletContent?.ChaletIntro} 
      />
      <Equipment
        dataContent={chaletContent?.Equipment}
        dataEquipment={equipment}
      />
      <Gallery
        dataContent={galleryContentForChalet}
        dataImage={gallery}
      />
      <PracticalInformation
        dataContent={chaletContent?.PracticalInformation}
      />
    </>
  );
}