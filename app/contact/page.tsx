import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { prisma } from "@/lib/prisma";

export default async function ContactPage() {
  const contentData = await prisma.content.findMany({
    where: { page: "contact" }
  });

  const infoData = await prisma.contactInfo.findMany();
  const formFieldsData = await prisma.formField.findMany();

  // Transformation des données 
  const content = contentData?.reduce((acc, item) => {
    if (!acc[item.component]) acc[item.component] = {};
    acc[item.component][item.key] = item.value;
    return acc;
  }, {} as any);

  const contactInfoItems = infoData || [];
  const formFields = formFieldsData?.reduce((acc: Record<string, any>, field: { fieldName: string; label: string; placeholder: string; id: number }) => {
    acc[field.fieldName] = { label: field.label, placeholder: field.placeholder, id: field.id };
    return acc;
  }, {} as Record<string, any>) || {};

  return (
    <>
      <PageHero
        dataContent={content?.PageHero}
        page="contact"
      />
      <ContactForm
        dataContent={content?.ContactForm}
        dataInfo={contactInfoItems}
        formFields={formFields as any}
      />
    </>
  );
}