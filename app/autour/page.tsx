import PageHero from "@/components/PageHero";
import LocalFavorites from "@/components/LocalFavorites";
import SeasonalWrapper from "@/components/SeasonalWrapper";
import { prisma } from "@/lib/prisma";

export default async function AutourPage() {
  const contentData = await prisma.content.findMany({
    where: { page: "autour" }
  });

  const activitiesData = await prisma.activity.findMany();
  const nearbyData = await prisma.nearby.findMany();
  const favoritesData = await prisma.favorite.findMany();

  // Transformation des données
  const content = contentData?.reduce((acc: any, item) => {
    if (!acc[item.component]) acc[item.component] = {};
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as any);

  const seasonalData = {
    images: {
      winter: content?.ActivitiesSection?.winter_image_src || "",
      winter_alt: content?.ActivitiesSection?.winter_image_alt || "",
      summer: content?.ActivitiesSection?.summer_image_src || "",
      summer_alt: content?.ActivitiesSection?.summer_image_alt || "",
    },
    activities: {
      winter: activitiesData?.filter((a) => a.season === "winter") || [],
      summer: activitiesData?.filter((a) => a.season === "summer") || [],
    },
    nearby: {
      winter: nearbyData?.filter((n) => n.season === "winter") || [],
      summer: nearbyData?.filter((n) => n.season === "summer") || [],
    },
  };

  const favorites = favoritesData || [];

  return (
    <>
      <PageHero 
        dataContent={content?.PageHero}
        page="autour"
      />
      <SeasonalWrapper 
        data={seasonalData}
      />
      <LocalFavorites
        dataContent={content?.LocalFavorites}
        dataFavorites={favorites}
        page="autour"
      />
    </>
  );
}