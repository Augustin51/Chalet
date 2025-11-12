import Availability from "@/components/Availability";
import ImportantInfo from "@/components/ImportantInfo";
import Price from "@/components/Price";
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

const getCalendrierPageData = cache(async () => {
  const { data: contentData, error: contentError } = await supabase
    .from('Content')
    .select('*')
    .eq('page', 'calendrier');

  const { data: priceData, error: priceError } = await supabase
    .from('PriceTier')
    .select('*');

  const { data: infoData, error: infoError } = await supabase
    .from('InfoItem')
    .select('*');

  if (contentError || priceError || infoError) {
    console.error("Erreur BDD (Calendrier):", contentError || priceError || infoError);
  }
  
  const content = formatContent(contentData || []);

  return { 
    content,
    priceTiers: priceData || [],
    infoItems: infoData || []
  };
});


export default async function CalendrierPage() {   
  const { content, priceTiers, infoItems } = await getCalendrierPageData();
  return (
    <>
      <Availability 
        dataContent={content.Availability}
      />
      <Price 
        dataContent={content.Price}
        dataPriceTiers={priceTiers}
      />
      <ImportantInfo 
        dataContent={content.ImportantInfo}
        dataInfoItems={infoItems}
      />
    </>
  );
}