import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import HomeHero from "@/components/HomeHero";
import { createServerSupabase } from "@/lib/supabase/server";
import { cache } from 'react';

function formatContent(contentList: any[]) {
  return contentList.reduce((acc, item) => {
    if (!acc[item.component]) {
      acc[item.component] = {};
    }
    acc[item.component][item.key] = item.value;
    return acc;
  }, {});
}

const getHomePageData = cache(async () => {
  const supabase = createServerSupabase(); 
  
  const { data: contentData, error: contentError } = await supabase
    .from('Content')
    .select('*')
    .eq('page', 'home');

  const { data: featuresData, error: featuresError } = await supabase
    .from('Feature')
    .select('*');

  const { data: galleryData, error: galleryError } = await supabase
    .from('GalleryImage')
    .select('*')
    .limit(6); 

  if (contentError || featuresError || galleryError) {
    console.error("Erreur de BDD:", contentError || featuresError || galleryError);
  }
  
  const content = formatContent(contentData || []);

  return { 
    content, 
    features: featuresData || [],
    gallery: galleryData || []
  };
});

export default async function Home() {
  const { content, features, gallery } = await getHomePageData();
  return (
    <>
      <HomeHero 
        dataContent={content.HomeHero} 
      />
      <Features 
        dataContent={content.Features}
        dataFeature={features}
      />
      <Gallery
        dataContent={content.Gallery}
        dataImage={gallery}
      />
    </>
  );
}