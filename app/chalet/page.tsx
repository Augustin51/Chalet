import ChaletIntro from "@/components/ChaletIntro";
import PageHero from "@/components/PageHero";

export default function ChaletPage() {
  return (
    <>
      <PageHero
        title="Le Chalet"
        description="Votre chalet de charme dans le Jura" 
      />
      <ChaletIntro />
    </>
  );
}