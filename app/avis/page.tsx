import PageHero from "@/components/PageHero";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";

export default function About() {
  return (
    <>
    <PageHero
      title="Avis de nos hôtes"
      description="Découvrez les témoignages de nos visiteurs"
    />
    <Stats />
    <Testimonials />
    </>
  )
}