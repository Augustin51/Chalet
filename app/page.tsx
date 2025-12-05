import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import HomeHero from "@/components/HomeHero";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const contentData = await prisma.content.findMany({
    where: { page: "home" }
  });

  const featuresData = await prisma.feature.findMany();
  const galleryData = await prisma.galleryImage.findMany({ take: 6 });

  const content = contentData?.reduce((acc, item) => {
    if (!acc[item.component]) acc[item.component] = {};
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as any);

  return (
    <>
      <HomeHero dataContent={content?.HomeHero} />
      <Features dataContent={content?.Features} dataFeature={featuresData || []} />
      <Gallery dataContent={content?.Gallery} dataImage={galleryData || []} />
    </>
  );
}
