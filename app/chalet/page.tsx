import ChaletIntro from "@/components/ChaletIntro";
import Equipment from "@/components/Equipment";
import Gallery from "@/components/Gallery";
import PageHero from "@/components/PageHero";
import PracticalInformation from "@/components/PracticalInformation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ChaletPage() {
  const supabase = createSupabaseServerClient();

  const { data: chaletContentData, error: contentError } = await supabase
    .from("Content")
    .select("*")
    .eq("page", "chalet");

  const { data: sharedGalleryContentData, error: galleryContentError } =
    await supabase
      .from("Content")
      .select("*")
      .eq("page", "home")
      .eq("component", "Gallery");

  const { data: equipmentData, error: equipmentError } = await supabase
    .from("Equipment")
    .select("*");

  const { data: galleryData, error: galleryError } = await supabase
    .from("GalleryImage")
    .select("*");

  if (contentError || equipmentError || galleryError || galleryContentError) {
    console.error(
      "Erreur BDD (Chalet):",
      contentError || equipmentError || galleryError || galleryContentError
    );
  }

  // Transformation des données
  const chaletContent = chaletContentData?.reduce((acc, item) => {
    if (!acc[item.component]) acc[item.component] = {};
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as any);

  // Transformation pour le contenu partagé de la galerie
  const sharedGalleryContentTemp = sharedGalleryContentData?.reduce(
    (acc, item) => {
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