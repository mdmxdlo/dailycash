"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function OnboardingGuide() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // We use a slight delay to ensure the page components are fully rendered
    const timer = setTimeout(() => {
      const status = localStorage.getItem("daily_cash_onboarding");
      
      // If onboarding is already completed, do nothing
      if (status === "completed") return;

      const driveSteps = (steps: any[], nextPath?: string, nextStatus?: string) => {
        const driverObj = driver({
          showProgress: true,
          nextBtnText: nextPath ? "Suivant ➔" : "Terminer",
          prevBtnText: "Précédent",
          doneBtnText: "Terminer",
          popoverClass: "driverjs-theme",
          steps: steps,
          onPopoverRender: (popover, { config, state }) => {
            // Customize the popover rendering if needed
          },
          onDestroyStarted: () => {
            if (!driverObj.hasNextStep() && nextPath) {
              // Reached the end of this page's tour, move to next page
              if (nextStatus) localStorage.setItem("daily_cash_onboarding", nextStatus);
              driverObj.destroy();
              router.push(nextPath);
            } else if (!driverObj.hasNextStep() && !nextPath) {
              // Reached the absolute end of the tour
              localStorage.setItem("daily_cash_onboarding", "completed");
              driverObj.destroy();
            } else {
              // User clicked close prematurely
              localStorage.setItem("daily_cash_onboarding", "completed");
              driverObj.destroy();
            }
          },
        });
        driverObj.drive();
      };

      if (pathname === "/" && (!status || status === "dashboard")) {
        // Dashboard Tour
        driveSteps(
          [
            { element: "#tour-sidebar", popover: { title: "Bienvenue sur Daily Cash", description: "Ceci est votre menu de navigation principal. Il vous donne accès à tous vos outils.", side: "right", align: "start" } },
            { element: "#tour-stats", popover: { title: "Vos Statistiques", description: "En un coup d'œil, suivez votre chiffre d'affaires, vos prospects et vos tâches.", side: "bottom", align: "start" } },
            { element: "#tour-chart", popover: { title: "Évolution des Revenus", description: "Un graphique interactif pour visualiser la croissance de votre activité au fil des mois.", side: "top", align: "start" } }
          ],
          "/tasks",
          "tasks"
        );
      } else if (pathname === "/tasks" && status === "tasks") {
        // Tasks Tour
        driveSteps(
          [
            { element: "#tour-kanban", popover: { title: "Le Kanban", description: "Voici votre espace d'organisation. Glissez et déposez vos tâches entre les colonnes 'À faire', 'En cours' et 'Terminé'.", side: "top", align: "start" } },
            { element: "#tour-add-task", popover: { title: "Nouvelle Tâche", description: "Cliquez ici pour créer une nouvelle tâche et booster votre productivité.", side: "bottom", align: "start" } }
          ],
          "/clients",
          "clients"
        );
      } else if (pathname === "/clients" && status === "clients") {
        // CRM Tour
        driveSteps(
          [
            { element: "#tour-crm", popover: { title: "Mini CRM", description: "Gérez tous vos prospects et clients au même endroit. Suivez la valeur de votre pipeline.", side: "top", align: "start" } },
            { element: "#tour-add-client", popover: { title: "Nouveau Client", description: "Ajoutez un nouveau prospect dès que vous avez un contact commercial.", side: "bottom", align: "start" } }
          ],
          "/revenue",
          "revenue"
        );
      } else if (pathname === "/revenue" && status === "revenue") {
        // Revenue Tour
        driveSteps(
          [
            { element: "#tour-revenues", popover: { title: "Suivi Financier", description: "Ici, vous gardez une trace de chaque transaction, qu'elle soit payée ou en attente.", side: "top", align: "start" } }
          ],
          "/discipline",
          "discipline"
        );
      } else if (pathname === "/discipline" && status === "discipline") {
        // Discipline Tour
        driveSteps(
          [
            { element: "#tour-discipline", popover: { title: "Discipline & Habitudes", description: "Le secret du succès en freelance ! Cochez vos habitudes quotidiennes pour maintenir vos séries (streaks).", side: "top", align: "start" } },
            { element: "#tour-goal", popover: { title: "Félicitations ! 🎉", description: "Vous savez maintenant utiliser Daily Cash. Concentrez-vous sur vos objectifs, l'outil s'occupe du reste.", side: "bottom", align: "start" } }
          ],
          undefined,
          "completed"
        );
      }
    }, 500); // 500ms delay to let the UI finish animating/loading

    return () => clearTimeout(timer);
  }, [pathname, mounted, router]);

  return null;
}
