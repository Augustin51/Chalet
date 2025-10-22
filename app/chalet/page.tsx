import ChaletIntro from "@/components/ChaletIntro";
import Equipment from "@/components/Equipment";
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
    </>
  );
}