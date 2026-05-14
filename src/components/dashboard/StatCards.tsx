"use client";

import { TrendingUp, Users, CheckCircle, Flame } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/utils/currency";

export function StatCards() {
  const revenues = useStore(state => state.revenues);
  const clients = useStore(state => state.clients);
  const tasks = useStore(state => state.tasks);
  const user = useStore(state => state.user);

  const totalRevenue = revenues.filter(r => r.status === "Payé").reduce((sum, r) => sum + r.amount, 0);
  const activeClientsCount = clients.filter(c => c.status === "Client").length;
  const completedTasksCount = tasks.filter(t => t.status === "done").length;

  const stats = [
    {
      title: "Revenus du mois",
      value: totalRevenue,
      suffix: "",
      trend: "+12.5%",
      icon: TrendingUp,
      positive: true,
      isCurrency: true,
    },
    {
      title: "Clients Actifs",
      value: activeClientsCount,
      suffix: "",
      trend: "+2",
      icon: Users,
      positive: true,
    },
    {
      title: "Tâches complétées",
      value: completedTasksCount,
      suffix: "",
      trend: "+3.2%",
      icon: CheckCircle,
      positive: true,
    },
    {
      title: "Série (Discipline)",
      value: 5,
      suffix: " Jours",
      trend: "Record: 12",
      icon: Flame,
      positive: true,
    },
  ];

  return (
    <div id="tour-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-6">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-card rounded-2xl p-3 sm:p-4 md:p-6 border border-border/50 shadow-sm relative overflow-hidden group hover:scale-[1.02] hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 fill-mode-both"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full max-w-[60px] sm:max-w-none truncate">
              {stat.trend}
            </span>
          </div>
          <h3 className="text-muted-foreground text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 truncate">{stat.title}</h3>
          <p className="text-base sm:text-xl md:text-2xl font-bold text-foreground truncate">
            {stat.isCurrency ? (
              <AnimatedNumber 
                value={stat.value} 
                formatter={(val) => formatCurrency(val, user?.currency)} 
                duration={1500 + (i * 200)} 
              />
            ) : (
              <AnimatedNumber 
                value={stat.value} 
                formatter={(val) => val.toLocaleString('fr-FR') + stat.suffix} 
                duration={1500 + (i * 200)} 
              />
            )}
          </p>
          
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
        </div>
      ))}
    </div>
  );
}
