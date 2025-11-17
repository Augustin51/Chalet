import PageHero from "@/components/PageHero";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AvisPage() {
  const supabase = createSupabaseServerClient();

  const { data: contentData, error: contentError } = await supabase
    .from("Content")
    .select("*")
    .eq("page", "avis");

  const { data: statData, error: statError } = await supabase
    .from("Stat")
    .select("*");

  const { data: testimonialData, error: testimonialError } = await supabase
    .from("Testimonial")
    .select("*");

  if (contentError || statError || testimonialError) {
    console.error(
      "Error DB (Avis):",
      contentError || statError || testimonialError
    );
  }

  // Transformation des données
  const content = contentData?.reduce((acc, item) => {
    if (!acc[item.component]) acc[item.component] = {};
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as any);

  const stats = statData || [];
  const testimonials = testimonialData || [];

  return (
    <>
      <PageHero 
        dataContent={content?.PageHero}
      />
      <Stats 
        dataStats={stats}
      />
      <Testimonials
        dataContent={content?.Testimonials}
        dataTestimonials={testimonials}
      />
    </>
  );
}