import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { LegalLayout } from "@/components/landing/LegalLayout";
import "@/app/landing.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-jakarta", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-inter", display: "swap" });

const SECTIONS = [
  {
    title: "Qu'est-ce que Daily Cash ?",
    content: "Daily Cash est un tableau de bord financier conçu pour les freelances africains. Il te permet de suivre tes revenus, gérer tes clients, organiser tes tâches et mesurer ta discipline au quotidien — tout en un seul endroit.",
  },
  {
    title: "Comment créer un compte ?",
    content: "Clique sur « Commencer gratuitement » depuis la page d'accueil. Renseigne ton prénom, ton email et un mot de passe. Un email de confirmation te sera envoyé — clique sur le lien pour activer ton compte et accéder au tableau de bord.",
  },
  {
    title: "Comment ajouter un revenu ?",
    content: "Depuis le tableau de bord, accède à la section « Revenus » dans le menu latéral. Clique sur « Nouveau revenu », renseigne le client, le montant, la date et le statut (Payé, En attente ou Annulé), puis valide.",
  },
  {
    title: "Comment gérer mes clients ?",
    content: "Accède à la section « Clients » dans la barre latérale. Tu peux ajouter un nouveau client avec son nom, email, téléphone et statut (Prospect, Contacté, En discussion, Client). Chaque client est lié à tes revenus pour un suivi complet.",
  },
  {
    title: "Comment fonctionne le Kanban de tâches ?",
    content: "La section « Tâches » affiche un tableau Kanban avec 3 colonnes : À faire, En cours, Terminé. Tu peux créer des tâches par catégorie (Prospection, Production, Contenu, Apprentissage) et les déplacer selon leur avancement.",
  },
  {
    title: "Comment fonctionne le score de discipline ?",
    content: "La page « Discipline » suit tes habitudes quotidiennes freelance. Tu peux noter ta journée, renseigner les tâches accomplies et suivre ta régularité dans le temps. C'est ton outil de responsabilité personnelle.",
  },
  {
    title: "Comment exporter mes données ?",
    content: "L'export CSV est disponible dans le plan Pro. Depuis la section « Revenus », clique sur le bouton « Exporter » en haut à droite pour télécharger toutes tes données financières au format CSV.",
  },
  {
    title: "Comment passer en plan Pro ?",
    content: "Depuis tes paramètres ou depuis la page Tarifs de la landing page, tu peux souscrire au plan Pro. L'abonnement est à 6 500 FCFA/mois ou 5 200 FCFA/mois en formule annuelle.",
  },
  {
    title: "Je n'arrive pas à me connecter — que faire ?",
    content: [
      "Vérifie que ton email est bien confirmé (regarde tes spams si nécessaire).",
      "Utilise le lien « Mot de passe oublié » sur la page de connexion.",
      "Si le problème persiste, contacte le support à support@dailycash.app.",
    ],
  },
  {
    title: "Comment contacter le support ?",
    content: "Tu peux nous écrire à support@dailycash.app. Nous répondons en général sous 24h (jours ouvrés). Les utilisateurs Pro bénéficient d'un support prioritaire.",
  },
];

export default function AidePage() {
  return (
    <div className={`${jakarta.variable} ${inter.variable}`}>
      <LegalLayout title="Centre d'aide" lastUpdated="14 mai 2026" sections={SECTIONS} />
    </div>
  );
}
