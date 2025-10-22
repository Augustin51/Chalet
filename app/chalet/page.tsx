import ChaletIntro from "@/components/ChaletIntro";
import Equipment from "@/components/Equipment";
import Gallery from "@/components/Gallery";
import PageHero from "@/components/PageHero";

export default function ChaletPage() {
  return (
    <>
      <PageHero
        title="Le Chalet"
        description="Votre chalet de charme dans le Jura" 
      />
      <ChaletIntro />
      <Equipment />
      <Gallery 
        description="Découvrez l'intérieur et l'extérieur du chalet"
      />
    </>
  );
}