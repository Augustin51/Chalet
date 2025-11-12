import PageHero from "@/components/PageHero";
import LocalFavorites from "@/components/LocalFavorites";
import SeasonalWrapper from "@/components/SeasonalWrapper";
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

const getAutourPageData = cache(async () => {
  const { data: contentData, error: contentError } = await supabase
    .from('Content')
    .select('*')
    .eq('page', 'autour');

  const { data: activitiesData, error: activitiesError } = await supabase
    .from('Activity')
    .select('*');

  const { data: nearbyData, error: nearbyError } = await supabase
    .from('Nearby')
    .select('*');

  const { data: favoritesData, error: favoritesError } = await supabase
    .from('Favorite')
    .select('*');

  if (contentError || activitiesError || nearbyError || favoritesError) {
    console.error("Error DB (Autour):", contentError || activitiesError || nearbyError || favoritesError);
  }
  
  const content = formatContent(contentData || []);

  const seasonalData = {
    images: {
      winter: content.ActivitiesSection?.winter_image_src || '',
      winter_alt: content.ActivitiesSection?.winter_image_alt || '',
      summer: content.ActivitiesSection?.summer_image_src || '',
      summer_alt: content.ActivitiesSection?.summer_image_alt || '',
    },
    activities: {
      winter: activitiesData?.filter(a => a.season === 'winter') || [],
      summer: activitiesData?.filter(a => a.season === 'summer') || [],
    },
    nearby: {
      winter: nearbyData?.filter(n => n.season === 'winter') || [],
      summer: nearbyData?.filter(n => n.season === 'summer') || [],
    }
  };

  return { 
    content, 
    seasonalData, 
    favorites: favoritesData || [] 
  };
});

export default async function AutourPage() {
  const { content, seasonalData, favorites } = await getAutourPageData();
  return (
    <>
      <PageHero
        dataContent={content.PageHero}
      />
      <SeasonalWrapper
        data={seasonalData}
      />
      <LocalFavorites 
        dataContent={content.LocalFavorites}
        dataFavorites={favorites}
      />
    </>
  );
}