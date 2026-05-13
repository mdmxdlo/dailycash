# 🧠 GEMINI.md - Documentation Projet "Daily Cash"

Ce document est un point de sauvegarde (checkpoint) généré par l'IA (Antigravity/Gemini) pour résumer l'état actuel du projet **Daily Cash**. Il servira de guide ultime pour tout futur modèle IA qui reprendra le développement.

---

## 🎯 1. Ce que l'application fait
**Daily Cash** est un tableau de bord (SaaS B2B) conçu spécifiquement pour les freelances. Son objectif est de centraliser la gestion financière (revenus, pipeline commercial), la gestion des clients (mini-CRM), l'organisation quotidienne (tâches) et le suivi des habitudes (discipline). Il offre une expérience utilisateur ultra-premium et réactive.

---

## ✨ 2. Toutes les fonctionnalités implémentées
Actuellement, l'application est un **prototype Front-end très avancé et 100% interactif** (les données sont sauvegardées localement dans le navigateur).

- **Tableau de Bord (Dashboard) :** 
  - 4 compteurs dynamiques (KPIs) avec animation de comptage (compte de 0 au chiffre exact).
  - Graphique de revenus (AreaChart) dynamique.
  - Les données affichées sont synchronisées en temps réel avec les autres pages.
- **Revenus :** 
  - Historique des transactions.
  - Formulaire modal complet (Zod + React Hook Form) pour ajouter un revenu.
  - Calcul automatique des revenus encaissés vs en attente.
- **Clients (Mini-CRM) :** 
  - Liste des clients avec barre de recherche.
  - Calcul du "Pipeline Total" basé sur les prospects en cours.
  - Formulaire modal d'ajout de client.
- **Tâches (Kanban) :** 
  - Véritable tableau Kanban (À faire, En cours, Terminé).
  - Fonctionnalité de **Glisser-Déposer (Drag & Drop)** pour déplacer les tâches entre les colonnes.
- **Paramètres :** 
  - Navigation par onglets (Profil, Préférences, Notifications).
  - Sélection d'avatar dynamique ou upload d'image locale.
  - Sélecteur de thème (Sombre/Clair) parfaitement fonctionnel.
- **Expérience Globale (UX) :**
  - **Zustand** : Toutes les données sont centralisées et persistent après un rafraîchissement (LocalStorage).
  - **Sonner** : Système de notifications (Toasts) moderne en bas à droite.
  - **Empty States** : Vues illustrées lorsque les tableaux de tâches, clients ou revenus sont vides.

---

## 📁 3. La structure des fichiers
Le projet utilise **Next.js 14 (App Router)**.

```text
src/
├── app/
│   ├── (auth)/             # [À VENIR] Pages de connexion / inscription
│   ├── (dashboard)/        # Routes principales protégées
│   │   ├── clients/page.tsx
│   │   ├── discipline/page.tsx
│   │   ├── revenue/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── tasks/page.tsx
│   │   └── page.tsx        # Dashboard principal
│   ├── globals.css         # Variables CSS et utilitaires Tailwind
│   └── layout.tsx          # Configuration de base (Sonner, Next-Themes)
├── components/
│   ├── dashboard/          # Composants spécifiques (StatCards, RevenueChart)
│   ├── layout/             # Sidebar et Topbar
│   └── ui/                 # Composants réutilisables (Modal, EmptyState, AnimatedNumber)
└── store/
    └── useStore.ts         # Le "Cerveau" de l'app (Store Zustand global)
```

---

## 🛠️ 4. Les technologies utilisées
- **Cœur** : Next.js 14, React 18, TypeScript.
- **Style** : Tailwind CSS, `next-themes` (Dark Mode).
- **Icônes** : `lucide-react`.
- **Gestion d'État** : `zustand` (avec middleware `persist`).
- **Formulaires & Validation** : `react-hook-form`, `zod`, `@hookform/resolvers`.
- **Graphiques** : `recharts`.
- **Interactivité** : `@hello-pangea/dnd` (Glisser-déposer Kanban), `sonner` (Notifications).

---

## 🎨 5. Les décisions de design (Règle d'or absolue)
L'application doit impérativement respirer le **"Premium" et le B2B Fintech**. Ne jamais proposer un design basique.
1. **Thème :** Dark Mode par défaut. Fond profond (`bg-background`), cartes légèrement plus claires (`bg-card`) avec des bordures subtiles (`border-border/50`).
2. **Couleur Primaire :** Le Vert Émeraude moderne (`text-primary`, `bg-primary`). Toujours l'utiliser pour mettre en évidence une action ou une donnée clé.
3. **Formes :** Tout est très arrondi. Les cartes principales utilisent `rounded-2xl`, les badges ou boutons d'actions `rounded-full` ou `rounded-xl`.
4. **Micro-interactions (L'effet "Wahou") :** 
   - Utilisation massive d'effets de lueur/glow derrière les cartes ou les icônes (ex: `bg-primary/5 blur-2xl` en absolute).
   - Les cartes doivent se soulever légèrement au survol (`hover:scale-[1.02]`).
   - L'apparition des pages et modales se fait toujours avec des animations fluides (`animate-in fade-in duration-500`).

---

## 🤖 6. Instructions pour un futur modèle IA
Si tu es une IA lisant ce fichier pour reprendre le projet, voici tes directives strictes :

1. **Ne casse pas le Design System :** Lisez toujours les règles de design définies dans `design.md` (fourni par le user) ou la section 5 ci-dessus. Tout nouveau composant doit s'intégrer harmonieusement et utiliser Tailwind. Pas de CSS brut.
2. **Architecture Zustand :** Actuellement, les données vivent dans `src/store/useStore.ts`. Si vous ajoutez une fonctionnalité, ajoutez les actions correspondantes dans ce store. Ne créez plus de `useState` locaux pour les données métier.
3. **Prochaine Étape (Priorité N°1) : INTÉGRATION BACKEND.**
   - L'application est actuellement un prototype Front-end "Persistant Localement". 
   - La prochaine mission est de remplacer le stockage Zustand local par une vraie base de données **Supabase** (PostgreSQL + Auth).
   - Il faudra gérer la création de compte, le login, et la récupération asynchrone des données depuis Supabase pour hydrater le store Zustand.
4. **Qualité du code :** Assurez-vous que les formulaires utilisent toujours Zod pour la validation. Gardez l'interface propre, sans erreurs de console.
