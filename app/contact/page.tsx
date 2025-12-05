import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { prisma } from "@/lib/prisma";

export default async function ContactPage() {
  const contentData = await prisma.content.findMany({
    where: { page: "contact" }
  });

  const infoData = await prisma.contactInfo.findMany();

  // Transformation des données 
  const content = contentData?.reduce((acc, item) => {
    if (!acc[item.component]) acc[item.component] = {};
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as any);

  const contactInfoItems = infoData || [];

  return (
    <>
      <PageHero
        dataContent={content?.PageHero}
        page="contact"
      />
      <ContactForm
        dataContent={content?.ContactForm}
        dataInfo={contactInfoItems}
      />
    </>
  );
}