import PageHero from "@/components/PageHero";
import LocalFavorites from "@/components/LocalFavorites";
import SeasonalWrapper from "@/components/SeasonalWrapper";
import { createServerSupabase } from "@/lib/supabase/server";
import { cache } from 'react';

const supabase = createServerSupabase();

interface ContentItem {
  component: string;
  key: string;
  value: any;
}

interface Activity {
  id: number;
  name: string;
  season: 'winter' | 'summer';
  [key: string]: any;
}

interface Nearby {
  id: number;
  name: string;
  season: 'winter' | 'summer';
  [key: string]: any;
}

interface Favorite {
  id: number;
  name: string;
  [key: string]: any;
}

function formatContent(contentList: ContentItem[]) {
  return contentList.reduce((acc, item) => {
    if (!acc[item.component]) {
      acc[item.component] = {};
    }
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as Record<string, Record<string, any>>);
}

const getAutourPageData = cache(async () => {
  const { data: contentData, error: contentError } = await supabase
    .from('Content')
    .select('*')
    .eq('page', 'autour');

  const { data: activitiesData, error: activitiesError } = await supabase
    .from<Activity>('Activity')
    .select('*');

  const { data: nearbyData, error: nearbyError } = await supabase
    .from<Nearby>('Nearby')
    .select('*');

  const { data: favoritesData, error: favoritesError } = await supabase
    .from<Favorite>('Favorite')
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
      winter: activitiesData?.filter((a: Activity) => a.season === 'winter') || [],
      summer: activitiesData?.filter((a: Activity) => a.season === 'summer') || [],
    },
    nearby: {
      winter: nearbyData?.filter((n: Nearby) => n.season === 'winter') || [],
      summer: nearbyData?.filter((n: Nearby) => n.season === 'summer') || [],
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
