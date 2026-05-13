"use client";

import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/utils/currency";

export function MonthlyGoal() {
  const user = useStore(state => state.user);
  const goal = user?.goal || 500000;
  
  // Calculate current total from revenues
  const revenues = useStore(state => state.revenues);
  const current = revenues.filter(r => r.status === "Payé").reduce((sum, r) => sum + r.amount, 0);
  
  const percentage = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group">
      <div>
        <h2 className="text-lg font-semibold mb-1">Objectif Mensuel</h2>
        <p className="text-sm text-muted-foreground">Progression vers votre but</p>
      </div>

      <div className="flex flex-col items-center justify-center py-6 relative z-10">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="hsl(var(--primary) / 0.1)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * percentage) / 100}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-foreground">{percentage}%</span>
            <span className="text-xs text-muted-foreground mt-1">Atteint</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 z-10">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Actuel</span>
          <span className="font-semibold">{formatCurrency(current, user?.currency)}</span>
        </div>
        <div className="w-full bg-border/50 h-px"></div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Objectif</span>
          <span className="font-semibold">{formatCurrency(goal, user?.currency)}</span>
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-0"></div>
    </div>
  );
}
