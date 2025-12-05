import PageHero from "@/components/PageHero";
import Availability from "@/components/Availability";
import ImportantInfo from "@/components/ImportantInfo";
import Price from "@/components/Price";
import { prisma } from "@/lib/prisma";

export default async function CalendrierPage() {
  const contentData = await prisma.content.findMany({
    where: { page: "calendrier" }
  });

  const priceData = await prisma.priceTier.findMany();
  const infoData = await prisma.infoItem.findMany();

  // Transformation des données
  const content = contentData?.reduce((acc: any, item: any) => {
    if (!acc[item.component]) acc[item.component] = {};
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as any);  const priceTiers = priceData || [];
  const infoItems = infoData || [];

  return (
    <>
      <Availability 
        dataContent={content?.Availability}
        page="calendrier"
      />
      <Price 
        dataContent={content?.Price}
        dataPriceTiers={priceTiers} 
        page="calendrier"
      />
      <ImportantInfo
        dataContent={content?.ImportantInfo}
        dataInfoItems={infoItems}
        page="calendrier"
      />
    </>
  );
}