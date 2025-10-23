import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";

export default function About() { 
  return (
    <>
    <PageHero
      title="Contactez-nous"
      description="Une question ? Un projet de séjour ? Parlons-en !"
    />
    <ContactForm />
    </>
  )
}