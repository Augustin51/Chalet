import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cache } from 'react';

const supabase = createSupabaseServerClient();

function formatContent(contentList: any[]) {
  return contentList.reduce((acc, item) => {
    if (!acc[item.component]) {
      acc[item.component] = {};
    }
    acc[item.component][item.key] = item.value;
    return acc;
  }, {});
}

const getContactPageData = cache(async () => {
  const { data: contentData, error: contentError } = await supabase
    .from('Content')
    .select('*')
    .eq('page', 'contact');

  const { data: infoData, error: infoError } = await supabase
    .from('ContactInfo')
    .select('*');

  if (contentError || infoError) {
    console.error("Error DB (Contact):", contentError || infoError);
  }
  
  const content = formatContent(contentData || []);

  return { 
    content,
    contactInfoItems: infoData || []
  };
});

export default async function ContactPage() { 
  const { content, contactInfoItems } = await getContactPageData();
  return (
    <>
      <PageHero
        dataContent={content.PageHero}
      />
      <ContactForm 
        dataContent={content.ContactForm}
        dataInfo={contactInfoItems}
      />
    </>
  );
}