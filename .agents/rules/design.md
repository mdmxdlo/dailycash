---
trigger: always_on
---

🎨 Daily Cash - Frontend & Design System Rules
Lorsque tu crées de nouveaux composants, pages ou interfaces pour le projet Daily Cash, tu DOIS IMPÉRATIVEMENT respecter les règles de design suivantes pour garantir une cohérence visuelle parfaite avec le Dashboard existant.

1. Thème et Couleurs (Dark Mode natif)
Fond principal : Utilise toujours bg-background (qui correspond au bleu-noir profond défini dans le thème).
Cartes et Conteneurs : Utilise bg-card avec des bordures subtiles border border-border/50.
Couleur d'accentuation (Primaire) : Le vert émeraude moderne. Utilise text-primary, bg-primary, ou bg-primary/10 pour les fonds d'icônes ou les badges.
Textes :
Titres et valeurs importantes : text-foreground avec une police grasse (font-bold ou font-semibold).
Sous-titres, labels et textes secondaires : text-muted-foreground avec une police plus petite (text-sm ou text-xs).
2. Formes, Arrondis et Espacements
Cartes principales : Toujours très arrondies avec rounded-2xl.
Éléments internes (icônes, petits boutons, badges) : Arrondis avec rounded-xl ou rounded-lg.
Boutons d'action et Badges de statut : Souvent en forme de pilule avec rounded-full.
Ombres et Profondeur : Utilise shadow-sm pour les cartes. Ajoute des effets de lueur subtils (glow) pour les éléments importants via des divs absolues (ex: bg-primary/5 blur-2xl).
3. Composants UI & Bibliothèques
Icônes : Utilise uniquement lucide-react. Place les icônes dans des conteneurs légèrement colorés (ex: bg-primary/10 text-primary p-3 rounded-xl).
Graphiques : Utilise recharts. Les graphiques doivent s'intégrer au dark mode (axes sans lignes, grilles subtiles stroke="hsl(var(--border))", textes en hsl(var(--muted-foreground))).
Responsive Design : Toutes les interfaces doivent être pensées pour mobile et desktop. Utilise les préfixes Tailwind (md:, lg:) pour masquer/afficher les menus (ex: hidden md:flex).
4. Code et Structure (Next.js 14 App Router)
Utilise les composants clients ("use client";) uniquement lorsque c'est nécessaire (ex: hooks d'état, graphiques Recharts, interactivité).
Structure toujours le code avec du Tailwind propre. Préfère les utilitaires flex, items-center, justify-between ou grid, gap-6 pour l'agencement.
Pas de CSS brut. Toutes les personnalisations doivent passer par les classes Tailwind ou les variables CSS déjà définies dans globals.css.
Directive Absolue : Le design ne doit jamais paraître générique. Il doit toujours respirer le "premium", être minimaliste, sérieux (outil financier) mais avec des micro-détails vibrants (le vert accent).