import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import HomeHero from "@/components/HomeHero";

export default function Home() {
  return (
    <>
    <HomeHero />
    <Features />
    <Gallery 
      description="Un aperçu de votre futur séjour"
      nbPhotoLimit={6}
    />
    </>
  );
}


