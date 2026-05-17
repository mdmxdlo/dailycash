"use client";

import { useState, useEffect } from "react";
import { Flame, Trophy, Target, CheckCircle2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

export default function DisciplinePage() {
  const tasks = useStore((state) => state.tasks);
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;

  const [note, setNote] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("daily_note");
    if (saved) setNote(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem("daily_note", note);
    toast.success("Note sauvegardée");
  };

  const stats = [
    {
      title: "Série Actuelle",
      value: "5 Jours",
      trend: "En cours",
      icon: Flame,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Meilleure Série",
      value: "12 Jours",
      trend: "Record personnel",
      icon: Trophy,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Complétion Hebdomadaire",
      value: "85%",
      trend: "+5% vs sem. dernière",
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Tâches du jour",
      value: totalTasks > 0 ? `${doneTasks}/${totalTasks}` : "0",
      trend: totalTasks > 0 ? `${Math.round((doneTasks / totalTasks) * 100)}% complété` : "Aucune tâche",
      icon: CheckCircle2,
      color: "text-primary",
      bg: "bg-primary/10"
    },
  ];

  // Mock data for weekly heatmap
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const completionData = [100, 80, 100, 60, 0, 0, 0];

  return (
    <div id="tour-discipline" className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discipline & Régularité</h1>
          <p className="text-muted-foreground mt-1">
            Visualisez votre constance. La discipline est la clé du succès en freelance.
          </p>
        </div>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <h3 className="text-muted-foreground text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{stat.title}</h3>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">{stat.trend}</p>
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-50 transition-all ${stat.bg.replace('/10', '')}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Analysis */}
        <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Analyse de la semaine</h2>
          <div className="space-y-4">
            {weekDays.map((day, idx) => (
              <div key={day} className="flex items-center gap-4">
                <span className="w-8 text-sm text-muted-foreground font-medium">{day}</span>
                <div className="flex-1 bg-background border border-border/50 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${completionData[idx]}%`,
                      backgroundColor: completionData[idx] === 100 ? 'hsl(var(--primary))' : completionData[idx] > 0 ? 'hsl(var(--primary) / 0.5)' : 'transparent'
                    }}
                  ></div>
                </div>
                <span className="w-10 text-right text-xs font-medium text-muted-foreground">
                  {completionData[idx]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Note / Journal */}
        <div id="tour-goal" className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Note du jour</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Prenez l'habitude de noter un bref bilan de votre journée.
          </p>
          {isMounted && (
            <textarea
              className="flex-1 bg-background border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none min-h-[150px]"
              placeholder="Qu'avez-vous accompli aujourd'hui ? Quelles sont les leçons apprises ?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
