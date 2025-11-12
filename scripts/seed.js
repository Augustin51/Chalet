const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'VOTRE_URL_SUPABASE';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'VOTRE_CLE_SERVICE_ROLE_SECRETE';

// Table Content
const contentData = [
  // Page: home
  { page: 'home', component: 'HomeHero', key: 'title', value: 'Le chalet au coeur du Jura' },
  { page: 'home', component: 'HomeHero', key: 'subtitle', value: 'Un chalet chaleureux entre lacs, forêts et montagnes' },
  { page: 'home', component: 'HomeHero', key: 'cta_primary_text', value: 'Réserver maintenant' },
  { page: 'home', component: 'HomeHero', key: 'cta_primary_link', value: '/calendrier' },
  { page: 'home', component: 'HomeHero', key: 'cta_secondary_text', value: 'Découvrir le chalet' },
  { page: 'home', component: 'HomeHero', key: 'cta_secondary_link', value: '/chalet' },
  { page: 'home', component: 'HomeHero', key: 'image_src', value: '/images/placeholder-bg.png' },
  { page: 'home', component: 'HomeHero', key: 'image_alt', value: 'Magnifique chalet en bois dans les montagnes enneigées au coucher du soleil' },
  { page: 'home', component: 'Features', key: 'title', value: 'Le chalet en bref' },
  { page: 'home', component: 'Features', key: 'subtitle', value: "Découvrez un lieu d'exception où authenticité rime avec modernité" },
  { page: 'home', component: 'Gallery', key: 'title', value: 'Galerie' },
  { page: 'home', component: 'Gallery', key: 'description', value: 'Un aperçu de votre futur séjour' },
  { page: 'home', component: 'Gallery', key: 'cta_text', value: 'Voir les disponibilités' },
  { page: 'home', component: 'Gallery', key: 'cta_link', value: '/calendrier' },

  // Page: chalet
  { page: 'chalet', component: 'PageHero', key: 'title', value: 'Le Chalet' },
  { page: 'chalet', component: 'PageHero', key: 'description', value: 'Votre chalet de charme dans le Jura' },
  { page: 'chalet', component: 'PageHero', key: 'image_src', value: '/images/placeholder-bg.png' },
  { page: 'chalet', component: 'PageHero', key: 'image_alt', value: 'Arrière-plan pour Le Chalet' },
  { page: 'chalet', component: 'ChaletIntro', key: 'title', value: 'Bienvenue dans votre Chalet' },
  { page: 'chalet', component: 'ChaletIntro', key: 'p1', value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam soluta incidunt a. In asperiores dolores culpa rerum sequi, doloremque ab dignissimos sapiente ipsa neque maiores dicta, quis voluptatem hic recusandae.' },
  { page: 'chalet', component: 'ChaletIntro', key: 'p2', value: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis exercitationem, ut eum nulla quae error consequatur impedit numquam. Nostrum, corrupti. Repellat cum reprehenderit minima deserunt voluptas accusamus eveniet iure fugiat.' },
  { page: 'chalet', component: 'ChaletIntro', key: 'p3', value: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit laborum ab, consequuntur omnis voluptate cum, cumque similique doloremque dolor numquam asperiores qui eveniet? Quisquam ipsa quod, reiciendis delectus facere voluptas.' },
  { page: 'chalet', component: 'Equipment', key: 'title', value: 'Équipements & Services' },
  { page: 'chalet', component: 'Gallery', key: 'description', value: "Découvrez l'intérieur et l'extérieur du chalet" },
  { page: 'chalet', component: 'PracticalInformation', key: 'main_title', value: 'Informations pratiques' },
  { page: 'chalet', component: 'PracticalInformation', key: 'card_access_title', value: 'Accès' },
  { page: 'chalet', component: 'PracticalInformation', key: 'card_access_content', value: 'Le chalet est facilement accessible en voiture. Garage privé disponible. En hiver, chaînes recommandées selon conditions météo.' },
  { page: 'chalet', component: 'PracticalInformation', key: 'card_rules_title', value: 'Règlement' },
  { page: 'chalet', component: 'PracticalInformation', key: 'card_rules_content', value: '• Arrivée : 16h00 - Départ : 10h00\n• Animaux non acceptés\n• Caution demandée' },
  { page: 'chalet', component: 'PracticalInformation', key: 'location_title', value: 'Localisation' },
  { page: 'chalet', component: 'PracticalInformation', key: 'location_map_src', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d657.5318767539773!2d6.028285152331494!3d46.638269989415505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478cffa6580849ef%3A0x4040f39774d4a836!2sG%C3%AEte%20des%20Rocqueries!5e0!3m2!1sfr!2sfr!4v1761141124864!5m2!1sfr!2sfr' },

  // Page: autour
  { page: 'autour', component: 'PageHero', key: 'title', value: 'Autour du Chalet' },
  { page: 'autour', component: 'PageHero', key: 'description', value: 'Un territoire riche en découvertes' },
  { page: 'autour', component: 'PageHero', key: 'image_src', value: '/images/placeholder-bg.png' },
  { page: 'autour', component: 'PageHero', key: 'image_alt', value: 'Arrière-plan pour Autour du Chalet' },
  { page: 'autour', component: 'ActivitiesSection', key: 'winter_image_src', value: '/images/placeholder.png' },
  { page: 'autour', component: 'ActivitiesSection', key: 'winter_image_alt', value: 'Paysage enneigé avec skieurs' },
  { page: 'autour', component: 'ActivitiesSection', key: 'summer_image_src', value: '/images/placeholder.png' },
  { page: 'autour', component: 'ActivitiesSection', key: 'summer_image_alt', value: 'Paysage de montagne en été' },
  { page: 'autour', component: 'LocalFavorites', key: 'title', value: 'Nos coups de cœur locaux' },
  { page: 'autour', component: 'LocalFavorites', key: 'subtitle', value: 'Les incontournables à découvrir absolument' },

  // Page: calendrier
  { page: 'calendrier', component: 'Availability', key: 'title', value: 'Disponibilités' },
  { page: 'calendrier', component: 'Availability', key: 'subtitle', value: 'Consultez nos disponibilités en temps réel' },
  { page: 'calendrier', component: 'Availability', key: 'placeholder_text', value: 'Calendrier interactif des disponibilités' },
  { page: 'calendrier', component: 'Price', key: 'title', value: 'Nos tarifs' },
  { page: 'calendrier', component: 'Price', key: 'subtitle', value: 'Des prix transparents selon la saison' },
  { page: 'calendrier', component: 'ImportantInfo', key: 'title', value: 'Informations importantes' },
  { page: 'calendrier', component: 'ImportantInfo', key: 'platform_text', value: 'Réservation possible également sur Abritel et Airbnb' },
  { page: 'calendrier', component: 'ImportantInfo', key: 'cta_contact_text', value: 'Nous contacter' },
  { page: 'calendrier', component: 'ImportantInfo', key: 'cta_contact_link', value: '/contact' },
  { page: 'calendrier', component: 'ImportantInfo', key: 'cta_platform_text', value: 'Voir sur Abritel' },
  { page: 'calendrier', component: 'ImportantInfo', key: 'cta_platform_link', value: '#' },

  // Page: avis
  { page: 'avis', component: 'PageHero', key: 'title', value: 'Avis de nos hôtes' },
  { page: 'avis', component: 'PageHero', key: 'description', value: 'Découvrez les témoignages de nos visiteurs' },
  { page: 'avis', component: 'PageHero', key: 'image_src', value: '/images/placeholder-bg.png' },
  { page: 'avis', component: 'PageHero', key: 'image_alt', value: 'Arrière-plan pour Avis de nos hôtes' },
  { page: 'avis', component: 'Testimonials', key: 'title', value: 'Ce que disent nos hôtes' },
  { page: 'avis', component: 'Testimonials', key: 'subtitle', value: 'Témoignages authentiques de voyageurs ayant séjourné au Refuge' },

  // Page: contact
  { page: 'contact', component: 'PageHero', key: 'title', value: 'Contactez-nous' },
  { page: 'contact', component: 'PageHero', key: 'description', value: 'Une question ? Un projet de séjour ? Parlons-en !' },
  { page: 'contact', component: 'PageHero', key: 'image_src', value: '/images/placeholder-bg.png' },
  { page: 'contact', component: 'PageHero', key: 'image_alt', value: 'Arrière-plan pour Contactez-nous' },
  { page: 'contact', component: 'ContactForm', key: 'title_left', value: 'Nos coordonnées' },
  { page: 'contact', component: 'ContactForm', key: 'title_right', value: 'Envoyez-nous un message' },
  { page: 'contact', component: 'ContactForm', key: 'button_text', value: 'Envoyer le message' },
  { page: 'contact', component: 'ContactForm', key: 'footer_text', value: 'Vos données sont protégées et ne seront jamais partagées.' },
];

// Table Feature
const featuresData = [
  { title: 'Confort & Charme', description: "Un chalet authentique alliant le charme du bois et le confort moderne", iconName: 'Heart' },
  { title: 'Proche des activités', description: "Ski, randonnées, lacs... Toutes les activités du Jura à portée de main", iconName: 'Compass' },
  { title: 'Réservation facile', description: "Disponibilités en temps réel et réservation simple et sécurisée", iconName: 'Calendar' },
];

// Table GalleryImage
const galleryData = [
  { src: "/img/placeholder.png", alt: "placeholder" }, { src: "/img/placeholder.png", alt: "placeholder" },
  { src: "/img/placeholder.png", alt: "placeholder" }, { src: "/img/placeholder.png", alt: "placeholder" },
  { src: "/img/placeholder.png", alt: "placeholder" }, { src: "/img/placeholder.png", alt: "placeholder" },
  { src: "/img/placeholder.png", alt: "placeholder" }, { src: "/img/placeholder.png", alt: "placeholder" },
  { src: "/img/placeholder.png", alt: "placeholder" }, { src: "/img/placeholder.png", alt: "placeholder" },
  { src: "/img/placeholder.png", alt: "placeholder" },
];

// Table Equipment
const equipmentData = [
  { label: "Wi-Fi gratuit", iconName: "Wifi" }, { label: "TV", iconName: "Tv" },
  { label: "Cuisine équipée", iconName: "UtensilsCrossed" }, { label: "Cheminée", iconName: "Snowflake" },
  { label: "Garage privé", iconName: "ParkingCircle" }, { label: "Équipements bébé", iconName: "Baby" },
];

// Table Activity
const activityData = [
  { title: "Ski alpin", description: "Station de ski à 5 minutes avec 200 km de pistes", season: "winter" },
  { title: "Ski de fond", description: "50 km de pistes de fond dans la vallée", season: "winter" },
  { title: "Raquettes", description: "Sentiers balisés au départ du chalet", season: "winter" },
  { title: "Luge", description: "Piste de luge éclairée en soirée", season: "winter" },
  { title: "Randonnée", description: "Plus de 100 sentiers de tous niveaux", season: "summer" },
  { title: "VTT", description: "Circuits VTT et location sur place", season: "summer" },
  { title: "Escalade", description: "Sites d’escalade naturels et via ferrata", season: "summer" },
  { title: "Lac et baignade", description: "Lac de montagne à 15 minutes", season: "summer" },
];

// Table Nearby
const nearbyData = [
  { time: "5 min", label: "Station de ski", color: "text-emerald-700", season: "winter" },
  { time: "10 min", label: "Centre-ville", color: "text-green-700", season: "winter" },
  { time: "15 min", label: "Lac de montagne", color: "text-amber-800", season: "winter" },
  { time: "5 min", label: "Station de ski", color: "text-emerald-700", season: "summer" },
  { time: "10 min", label: "Centre-ville", color: "text-green-700", season: "summer" },
  { time: "15 min", label: "Lac de montagne", color: "text-amber-800", season: "summer" },
];

// Table Favorite
const favoriteData = [
  { iconName: "MapPin", title: "Belvédères & Points de vue", details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi cupiditate earum, quasi quos, dolorum quo minima" },
  { iconName: "UtensilsCrossed", title: "Gastronomie locale", details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi cupiditate earum, quasi quos, dolorum quo minima" },
  { iconName: "MapPin", title: "Villages de charme", details: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi cupiditate earum, quasi quos, dolorum quo minima" },
];

// Table PriceTier
const priceTierData = [
  { title: "Basse saison", period: "Avril - Mai & Octobre - Novembre", price: "850€", description: "Tarif semaine hors vacances scolaires" },
  { title: "Moyenne saison", period: "Juin - Septembre", price: "1150€", description: "Tarif semaine, idéal pour randonnées estivales" },
  { title: "Haute saison", period: "Décembre - Mars & Vacances scolaires", price: "1450€", description: "Tarif semaine, période ski et fêtes de fin d'année" },
];

// Table InfoItem
const infoItemData = [
  { text: "Location à la semaine (WE hors periode scolaire)" },
  { text: "Arrivée le samedi à partir de 16h" },
  { text: "Départ le samedi avant 10h" },
  { text: "Draps et linge non fournis" },
  { text: "Ménage de fin de séjour en option (80€)" },
  { text: "Caution de 600€ demandée" },
];

// Table Stat
const statData = [
  { main: "4.9", sub: "Note moyenne", showStars: true },
  { main: "150+", sub: "Avis clients", showStars: false },
  { main: "98%", sub: "Recommandations", showStars: false },
];

// Table Testimonial
const testimonialData = [
  { name: "Sophie & Thomas", avatarUrl: "/img/placeholder-avatar.png", date: "Février 2024", stars: 5, source: "Google", review: "Un séjour absolument magique ! Le chalet est encore plus beau qu'en photos. La vue sur les montagnes est époustouflante, et l'intérieur est d'un confort exceptionnel. Nous avons adoré les soirées au coin du feu. Un vrai havre de paix. Nous reviendrons sans hésiter !" },
  { name: "Marie-Claire", avatarUrl: "/img/placeholder-avatar.png", date: "Août 2023", stars: 4, source: "Abritel", review: "Parfait pour des vacances en famille ! Le chalet est idéalement situé pour explorer le Jura. Très propre, bien équipé, et les propriétaires sont adorables et de bon conseil. Les enfants ont adoré la terrasse et les balades en forêt. Une adresse à garder précieusement." },
  { name: "Jean & Isabelle", avatarUrl: "/img/placeholder-avatar.png", date: "Décembre 2023", stars: 5, source: "Google", review: "Nous cherchions un endroit calme pour nous ressourcer, et nous avons été comblés. Le chalet respire l'authenticité et le charme montagnard. Tout est pensé pour le confort des hôtes. Nous recommandons vivement !" },
  { name: "Caroline", avatarUrl: "/img/placeholder-avatar.png", date: "Juillet 2023", stars: 5, source: "Abritel", review: "Week-end entre amis réussi ! Le chalet peut accueillir confortablement 8 personnes. L'espace est bien pensé, la décoration soignée. Parfait pour profiter de la nature et se détendre. Nous reviendrons pour un séjour plus long." },
];

// Table ContactInfo
const contactInfoData = [
  { title: "Adresse", content: "123 Rue des Sapins\n39220 Les Rousses\nJura, France", iconName: "MapPin" },
  { title: "Téléphone", content: "+33 (0)3 84 00 00 00", iconName: "Phone" },
  { title: "Email", content: "contact@refugehautjura.fr", iconName: "Mail" },
  { title: "Disponibilité", content: "Lun - Dim : 9h - 19h", iconName: "Clock" },
];


// Fonction pour insertion
async function seedTable(supabase, tableName, data) {
  // Optionnel: Vider la table d'abord
  const { error: deleteError } = await supabase.from(tableName).delete().gt('id', 0);
  if (deleteError) {
    console.warn(`Avertissement lors du vidage de "${tableName}": ${deleteError.message}`);
  }

  // Insérer les données
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select();
  
  if (error) {
    console.error(`❌ Erreur lors du remplissage de la table "${tableName}":`, error.message);
    return false;
  }
  
  console.log(`✅ Table "${tableName}" remplie avec ${result.length} lignes.`);
  return true;
}

// Fonction principale du seed
async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("❌ Erreur: SUPABASE_URL ou SUPABASE_SERVICE_KEY n'est pas défini. Vérifiez vos variables d'environnement.");
    return;
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Remplir toutes les tables
  await seedTable(supabase, 'Content', contentData);
  await seedTable(supabase, 'Feature', featuresData);
  await seedTable(supabase, 'GalleryImage', galleryData);
  await seedTable(supabase, 'Equipment', equipmentData);
  await seedTable(supabase, 'Activity', activityData);
  await seedTable(supabase, 'Nearby', nearbyData);
  await seedTable(supabase, 'Favorite', favoriteData);
  await seedTable(supabase, 'PriceTier', priceTierData);
  await seedTable(supabase, 'InfoItem', infoItemData);
  await seedTable(supabase, 'Stat', statData);
  await seedTable(supabase, 'Testimonial', testimonialData);
  await seedTable(supabase, 'ContactInfo', contactInfoData);
}

main().catch(console.error);