import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import HomeHero from "@/components/HomeHero";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createSupabaseServerClient(); // ✅ ok

  const { data: contentData } = await supabase
    .from("Content")
    .select("*")
    .eq("page", "home");

  const { data: featuresData } = await supabase.from("Feature").select("*");
  const { data: galleryData } = await supabase.from("GalleryImage").select("*").limit(6);

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
