# 🏔️ Le Chalet

> Site web moderne de location de chalet avec système d'administration en ligne intégré

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)


## 🎯 Présentation

**Le Chalet** est une plateforme web complète pour la gestion et la promotion d'un chalet de location. Le projet se distingue par son **système d'administration en ligne** permettant aux propriétaires de modifier le contenu du site en temps réel, sans connaissances techniques.

### Points forts

- ✨ **Interface moderne et responsive** - Design élégant adapté à tous les écrans
- 🎨 **Mode saisonnier** - Thème automatique Été/Hiver avec effets visuels
- ⚡ **Performance optimale** - Next.js 15 avec Turbopack pour un chargement ultra-rapide
- 🔐 **Authentification sécurisée** - Connexion admin via Supabase
- 📝 **Édition en ligne** - Modification du contenu directement sur le site
- 📅 **Calendrier de disponibilité** - Gestion des réservations en temps réel
- 📧 **Formulaire de contact** - Envoi d'emails automatique via Nodemailer
- 🖼️ **Gestion d'images** - Upload, modification et suppression avec vérification d'usage

## ✨ Fonctionnalités

### Pour les visiteurs

- 🏠 **Page d'accueil** - Présentation du chalet avec galerie photos
- 📍 **Activités aux alentours** - Découverte de la région
- 💰 **Tarifs et disponibilités** - Calendrier interactif des réservations
- 📝 **Page chalet** - Équipements, caractéristiques et informations pratiques
- ⭐ **Avis clients** - Témoignages vérifiés
- 📧 **Formulaire de contact** - Demande de renseignements

### Pour les administrateurs

- 🔐 **Connexion sécurisée** - Authentification via Supabase
- ✏️ **Édition en ligne** - Modification des textes, titres et descriptions
- 🖼️ **Gestion des images** - Upload, sélection, modification et suppression
- 📅 **Gestion du calendrier** - Ajout/modification/suppression des réservations
- 💬 **Gestion des avis** - CRUD complet sur les témoignages
- 🎨 **Personnalisation des liens** - Modification des boutons et redirections
- 🗑️ **Suppression intelligente** - Vérification d'usage avant suppression d'images

## 🛠 Technologies

### Frontend

- **Next.js 15** - Framework React avec App Router et Turbopack
- **React 19** - Bibliothèque UI avec Server Components
- **TypeScript** - Typage statique pour plus de robustesse
- **Tailwind CSS 4** - Framework CSS utility-first
- **Lucide React** - Bibliothèque d'icônes moderne

### Backend & Database

- **Prisma ORM** - Gestion de base de données type-safe
- **PostgreSQL** - Base de données relationnelle (via Supabase)
- **Supabase** - Backend-as-a-Service (Auth + Database)
- **Nodemailer** - Envoi d'emails pour le formulaire de contact

### Outils de développement

- **ESLint** - Linting du code
- **PostCSS** - Transformation CSS
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas

## 🏗 Architecture

### Structure du projet

```
Le_Chalet/
├── app/                          # Pages Next.js (App Router)
│   ├── api/                      # Routes API
│   │   ├── activity/             # Gestion activités
│   │   ├── contact/              # Formulaire contact
│   │   ├── content/              # Contenu éditable
│   │   ├── image/                # Upload/gestion images
│   │   ├── reservation/          # Calendrier réservations
│   │   └── testimonial/          # Gestion avis
│   ├── autour/                   # Page activités
│   ├── avis/                     # Page témoignages
│   ├── calendrier/               # Page disponibilités
│   ├── chalet/                   # Page détails chalet
│   ├── connexion/                # Page login admin
│   ├── contact/                  # Page contact
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Page d'accueil
├── components/                   # Composants React
│   ├── admin/                    # Composants admin
│   │   ├── inputs/               # Inputs éditables
│   │   ├── AdminCalendar.tsx    # Calendrier admin
│   │   ├── EditableImage.tsx    # Images éditables
│   │   ├── ImageSelectorModal.tsx # Modal sélection images
│   │   ├── ConfirmModal.tsx     # Modal confirmation
│   │   └── AlertModal.tsx       # Modal alertes
│   ├── calendar/                 # Composants calendrier
│   ├── chalet/                   # Composants page chalet
│   ├── common/                   # Composants communs
│   ├── contact/                  # Formulaire contact
│   ├── home/                     # Composants accueil
│   ├── layout/                   # Layout components
│   ├── nearby/                   # Activités région
│   ├── pricing/                  # Tarification
│   ├── shared/                   # Composants partagés
│   ├── testimonials/             # Témoignages
│   └── ui/                       # Composants UI (shadcn)
├── lib/                          # Utilitaires
├── prisma/                       # Schéma base de données
├── public/                       # Assets statiques
└── utils/                        # Fonctions utilitaires

```


## 🌐 Accès au site

Le site est accessible en ligne à l'adresse suivante :

**🔗 [https://le-chalet.vercel.app](https://le-chalet.vercel.app)**


## ⚙️ Configuration

### Mode visiteur

Naviguez simplement sur le site pour découvrir :
- La page d'accueil avec présentation et galerie
- Les détails du chalet et ses équipements
- Le calendrier de disponibilité
- Les avis clients
- Les activités aux alentours

### Mode administrateur

1. **Édition de contenu** :
   - Cliquer sur n'importe quel texte éditable
   - Modifier le contenu
   - Appuyer sur **Entrée** ou cliquer ailleurs pour sauvegarder
2. **Gestion d'images** :
   - Cliquer sur une image pour la modifier
   - Utiliser le bouton "Ajouter une image" dans la galerie
   - Uploader ou choisir une image existante
3. **Gestion du calendrier** :
   - Cliquer sur "+ Nouvelle réservation" pour ajouter
   - Cliquer sur une réservation pour modifier/supprimer
4. **Gestion des avis** :
   - Utiliser les boutons pour ajouter/modifier/supprimer




## 👤 Auteur

- GitHub: [@Augustin51](https://github.com/Augustin51)


