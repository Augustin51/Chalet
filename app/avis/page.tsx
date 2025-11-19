import PageHero from "@/components/PageHero";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
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

const getAvisPageData = cache(async () => {
  const supabase = createServerSupabase(); 
  
  const { data: contentData, error: contentError } = await supabase
    .from('Content')
    .select('*')
    .eq('page', 'avis');

  const { data: statData, error: statError } = await supabase
    .from('Stat')
    .select('*');

  const { data: testimonialData, error: testimonialError } = await supabase
    .from('Testimonial')
    .select('*');

  if (contentError || statError || testimonialError) {
    console.error("Error DB (Avis):", contentError || statError || testimonialError);
  }
  
  const content = formatContent(contentData || []);

  return { 
    content,
    stats: statData || [],
    testimonials: testimonialData || []
  };
});

export default async function AvisPage() { 
  const { content, stats, testimonials } = await getAvisPageData();
  return (
    <>
      <PageHero
        dataContent={content.PageHero}
      />
      <Stats 
        dataStats={stats}
      />
      <Testimonials 
        dataContent={content.Testimonials}
        dataTestimonials={testimonials}
      />
    </>
  );
}