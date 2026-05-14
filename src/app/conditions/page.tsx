import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { LegalLayout } from "@/components/landing/LegalLayout";
import "@/app/landing.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-jakarta", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-inter", display: "swap" });

const SECTIONS = [
  {
    title: "Acceptation des conditions",
    content: "En accédant à Daily Cash et en créant un compte, vous acceptez pleinement et sans réserve les présentes Conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.",
  },
  {
    title: "Description du service",
    content: "Daily Cash est une application web de gestion financière et de productivité destinée aux freelances. Elle permet de suivre les revenus, gérer les clients, organiser les tâches et mesurer la discipline quotidienne. Le service est fourni en l'état, avec un plan Gratuit et un plan Pro.",
  },
  {
    title: "Création de compte",
    content: [
      "Vous devez avoir au moins 18 ans pour créer un compte.",
      "Vous êtes responsable de la confidentialité de vos identifiants de connexion.",
      "Vous vous engagez à fournir des informations exactes lors de l'inscription.",
      "Un seul compte par personne est autorisé.",
      "Toute activité effectuée depuis votre compte est sous votre responsabilité.",
    ],
  },
  {
    title: "Utilisation acceptable",
    content: [
      "Utiliser Daily Cash uniquement à des fins légales et personnelles/professionnelles légitimes.",
      "Ne pas tenter de contourner les mesures de sécurité ou d'accéder aux données d'autres utilisateurs.",
      "Ne pas utiliser le service pour stocker ou traiter des données illicites.",
      "Ne pas reproduire, copier ou revendre tout ou partie du service sans autorisation écrite.",
    ],
  },
  {
    title: "Abonnement et paiement",
    content: [
      "Le plan Gratuit est accessible sans frais ni carte bancaire.",
      "Le plan Pro est facturé 6 500 FCFA/mois ou 5 200 FCFA/mois (engagement annuel, soit 62 400 FCFA/an).",
      "Les paiements sont prélevés mensuellement ou annuellement selon la formule choisie.",
      "Les tarifs peuvent être modifiés avec un préavis de 30 jours par email.",
      "Aucun remboursement n'est accordé pour les périodes déjà facturées, sauf obligation légale.",
    ],
  },
  {
    title: "Résiliation et annulation",
    content: "Vous pouvez annuler votre abonnement Pro à tout moment depuis les paramètres de votre compte. L'annulation prend effet à la fin de la période de facturation en cours. Vous conservez l'accès Pro jusqu'à cette date. La suppression de votre compte entraîne la perte définitive de toutes vos données.",
  },
  {
    title: "Propriété intellectuelle",
    content: "Daily Cash et tous ses éléments (logo, interface, code, textes) sont la propriété exclusive de leurs créateurs et sont protégés par les lois applicables sur la propriété intellectuelle. Vos données (revenus, clients, tâches) restent votre propriété exclusive.",
  },
  {
    title: "Disponibilité du service",
    content: "Nous nous efforçons de maintenir Daily Cash disponible 24h/24 et 7j/7. Cependant, des interruptions peuvent survenir pour maintenance ou en cas de force majeure. Nous ne pouvons être tenus responsables des pertes consécutives à une indisponibilité du service.",
  },
  {
    title: "Limitation de responsabilité",
    content: "Daily Cash est un outil d'aide à la gestion et ne constitue pas un conseil financier ou comptable professionnel. Nous ne sommes pas responsables des décisions financières prises sur la base des données affichées. Notre responsabilité est limitée au montant payé pour le service au cours des 3 derniers mois.",
  },
  {
    title: "Modifications des conditions",
    content: "Nous nous réservons le droit de modifier ces Conditions d'utilisation à tout moment. En cas de modification substantielle, vous serez notifié par email avec un préavis de 15 jours. La poursuite de l'utilisation du service après cette période vaut acceptation des nouvelles conditions.",
  },
  {
    title: "Contact",
    content: "Pour toute question relative aux présentes conditions, contactez-nous à legal@dailycash.app.",
  },
];

export default function ConditionsPage() {
  return (
    <div className={`${jakarta.variable} ${inter.variable}`}>
      <LegalLayout title="Conditions d'utilisation" lastUpdated="14 mai 2026" sections={SECTIONS} />
    </div>
  );
}
