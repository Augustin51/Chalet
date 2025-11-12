import ChaletIntro from "@/components/ChaletIntro";
import Equipment from "@/components/Equipment";
import Gallery from "@/components/Gallery";
import PageHero from "@/components/PageHero";
import PracticalInformation from "@/components/PracticalInformation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cache } from 'react';

const supabase = createSupabaseServerClient();

function formatContent(contentList: any[]) {
  return contentList.reduce((acc, item) => {
    if (!acc[item.component]) {
      acc[item.component] = {};
    }
    acc[item.component][item.key] = item.value;
    return acc;
  }, {});
}

const getChaletPageData = cache(async () => {
  const { data: chaletContentData, error: contentError } = await supabase
    .from('Content')
    .select('*')
    .eq('page', 'chalet');

  const { data: sharedGalleryContentData, error: galleryContentError } = await supabase
    .from('Content')
    .select('*')
    .eq('page', 'home')
    .eq('component', 'Gallery');

  const { data: equipmentData, error: equipmentError } = await supabase
    .from('Equipment')
    .select('*');

  const { data: galleryData, error: galleryError } = await supabase
    .from('GalleryImage')
    .select('*');

  if (contentError || equipmentError || galleryError || galleryContentError) {
    console.error("Erreur BDD (Chalet):", contentError || equipmentError || galleryError || galleryContentError);
  }

  const chaletContent = formatContent(chaletContentData || []);
  const sharedGalleryContent = formatContent(sharedGalleryContentData || [])['Gallery'] || {};

  return { 
    chaletContent,
    sharedGalleryContent,
    equipment: equipmentData || [],
    gallery: galleryData || []
  };
});

export default async function ChaletPage() {
  const { chaletContent, sharedGalleryContent, equipment, gallery } = await getChaletPageData();

  const galleryContentForChalet = {
    ...sharedGalleryContent,
    description: chaletContent.Gallery?.description || sharedGalleryContent.description,
  };

  return (
    <>
      <PageHero
        dataContent={chaletContent.PageHero}
      />
      <ChaletIntro 
        dataContent={chaletContent.ChaletIntro}
      />
      <Equipment 
        dataContent={chaletContent.Equipment}
        dataEquipment={equipment}
      />
      <Gallery 
        dataContent={galleryContentForChalet}
        dataImage={gallery}
      />
      <PracticalInformation 
        dataContent={chaletContent.PracticalInformation}
      />
    </>
  );
}