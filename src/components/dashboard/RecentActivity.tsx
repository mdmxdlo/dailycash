"use client";

import { CheckCircle2, DollarSign, UserPlus, FileText } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/utils/currency";

export function RecentActivity() {
  const user = useStore(state => state.user);

  const activities = [
    {
      id: 1,
      type: "revenue",
      title: "Paiement reçu : Refonte UI",
      client: "TechCorp SARL",
      amount: `+ ${formatCurrency(150000, user?.currency)}`,
      time: "Aujourd'hui, 10:42",
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      id: 2,
      type: "task",
      title: "Tâche terminée : Wireframes v2",
      client: "Projet Interne",
      amount: null,
      time: "Hier, 16:30",
      icon: CheckCircle2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: 3,
      type: "client",
      title: "Nouveau prospect : StartupX",
      client: "Contact via Dribbble",
      amount: "Valeur est. 500k",
      time: "Hier, 09:15",
      icon: UserPlus,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      id: 4,
      type: "invoice",
      title: "Facture envoyée : Dev complet",
      client: "Agence Digitale",
      amount: "En attente",
      time: "10 Mai, 14:00",
      icon: FileText,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold">Activité Récente</h2>
        <button className="text-xs sm:text-sm text-primary hover:underline">Voir tout</button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start justify-between group">
            <div className="flex items-start gap-2.5 sm:gap-4 min-w-0 flex-1">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${activity.bg} ${activity.color} mt-0.5 sm:mt-1 shrink-0`}>
                <activity.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {activity.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-0.5">{activity.client}</p>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                  {activity.time}
                </p>
              </div>
            </div>
            {activity.amount && (
              <div className="text-right shrink-0 ml-2">
                <span className={`text-xs sm:text-sm font-medium whitespace-nowrap ${activity.type === 'revenue' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {activity.amount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
