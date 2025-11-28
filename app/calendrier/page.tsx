import PageHero from "@/components/PageHero";
import Availability from "@/components/Availability";
import ImportantInfo from "@/components/ImportantInfo";
import Price from "@/components/Price";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CalendrierPage() {
  const supabase = createSupabaseServerClient();

  const { data: contentData, error: contentError } = await supabase
    .from("Content")
    .select("*")
    .eq("page", "calendrier");

  const { data: priceData, error: priceError } = await supabase
    .from("PriceTier")
    .select("*");

  const { data: infoData, error: infoError } = await supabase
    .from("InfoItem")
    .select("*");

  if (contentError || priceError || infoError) {
    console.error(
      "Erreur BDD (Calendrier):",
      contentError || priceError || infoError
    );
  }

  // Transformation des données 
  const content = contentData?.reduce((acc, item) => {
    if (!acc[item.component]) acc[item.component] = {};
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as any);

  const priceTiers = priceData || [];
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