import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { LegalLayout } from "@/components/landing/LegalLayout";
import "@/app/landing.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-jakarta", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-inter", display: "swap" });

const SECTIONS = [
  {
    title: "Introduction",
    content: "Daily Cash s'engage à protéger la vie privée de ses utilisateurs. Cette politique explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits. En utilisant Daily Cash, vous acceptez les pratiques décrites dans ce document.",
  },
  {
    title: "Données collectées",
    content: [
      "Informations de compte : nom, adresse email et mot de passe (chiffré).",
      "Données financières : revenus, montants, dates et statuts de paiement que vous saisissez.",
      "Données clients : noms, emails, téléphones et statuts de vos prospects/clients.",
      "Données de tâches : intitulés, catégories et statuts de vos tâches.",
      "Données de connexion : adresse IP, navigateur et horodatage des sessions (à des fins de sécurité).",
    ],
  },
  {
    title: "Utilisation des données",
    content: [
      "Fournir et améliorer le service Daily Cash.",
      "Vous envoyer des emails transactionnels (confirmation de compte, réinitialisation de mot de passe).",
      "Assurer la sécurité de votre compte.",
      "Calculer les statistiques agrégées et anonymisées pour améliorer l'expérience utilisateur.",
    ],
  },
  {
    title: "Partage des données",
    content: "Nous ne vendons, ne louons et ne partageons jamais vos données personnelles avec des tiers à des fins commerciales. Vos données peuvent être partagées uniquement avec nos prestataires techniques (Supabase pour l'hébergement) dans le strict cadre de la fourniture du service.",
  },
  {
    title: "Hébergement et sécurité",
    content: "Toutes vos données sont hébergées sur l'infrastructure sécurisée de Supabase (base de données PostgreSQL chiffrée). Les connexions sont protégées par le protocole HTTPS/TLS. Les mots de passe sont hachés et ne sont jamais stockés en clair.",
  },
  {
    title: "Cookies",
    content: "Daily Cash utilise des cookies strictement nécessaires au fonctionnement du service (gestion de session d'authentification). Nous n'utilisons pas de cookies publicitaires ou de tracking tiers.",
  },
  {
    title: "Durée de conservation",
    content: "Vos données sont conservées tant que votre compte est actif. En cas de suppression de votre compte, toutes vos données personnelles sont effacées définitivement dans un délai de 30 jours.",
  },
  {
    title: "Vos droits",
    content: [
      "Droit d'accès : vous pouvez demander une copie de vos données à tout moment.",
      "Droit de rectification : vous pouvez corriger vos informations depuis les paramètres de votre compte.",
      "Droit à l'effacement : vous pouvez supprimer votre compte et toutes vos données depuis les paramètres.",
      "Droit à la portabilité : vous pouvez exporter vos revenus au format CSV (plan Pro).",
      "Pour exercer ces droits, contactez-nous à : privacy@dailycash.app",
    ],
  },
  {
    title: "Modifications de la politique",
    content: "Nous pouvons mettre à jour cette politique de confidentialité. En cas de modification substantielle, vous serez notifié par email. La date de dernière mise à jour est indiquée en haut de cette page.",
  },
  {
    title: "Contact",
    content: "Pour toute question relative à la protection de vos données, contactez-nous à privacy@dailycash.app.",
  },
];

export default function ConfidentialitePage() {
  return (
    <div className={`${jakarta.variable} ${inter.variable}`}>
      <LegalLayout title="Politique de confidentialité" lastUpdated="14 mai 2026" sections={SECTIONS} />
    </div>
  );
}
