import PageHero from "@/components/PageHero";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import { prisma } from "@/lib/prisma";

export default async function AvisPage() {
  const contentData = await prisma.content.findMany({
    where: { page: "avis" }
  });

  const statData = await prisma.stat.findMany();
  const testimonialData = await prisma.testimonial.findMany();

  // Transformation des données
  const content = contentData?.reduce((acc: any, item: any) => {
    if (!acc[item.component]) acc[item.component] = {};
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as any);

  const stats = statData || [];
  const testimonials = testimonialData || [];
  
  // Récupérer toutes les sources uniques
  const uniqueSources = [...new Set(testimonials.map((t: any) => t.source).filter(Boolean))];

  return (
    <>
      <PageHero 
        dataContent={content?.PageHero}
        page="avis"
      />
      <Stats 
        dataStats={stats}
      />
      <Testimonials
        dataContent={content?.Testimonials}
        dataTestimonials={testimonials}
        availableSources={uniqueSources}
      />
    </>
  );
}