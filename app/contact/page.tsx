import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ContactPage() {
  const supabase = createSupabaseServerClient();

  const { data: contentData, error: contentError } = await supabase
    .from("Content")
    .select("*")
    .eq("page", "contact");

  const { data: infoData, error: infoError } = await supabase
    .from("ContactInfo")
    .select("*");

  if (contentError || infoError) {
    console.error("Error DB (Contact):", contentError || infoError);
  }

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