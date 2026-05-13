import { Flame, Trophy, Target, CheckCircle2 } from "lucide-react";

export default function DisciplinePage() {
  const stats = [
    {
      title: "Série Actuelle",
      value: "5 Jours",
      trend: "En cours",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      title: "Meilleure Série",
      value: "12 Jours",
      trend: "Record personnel",
      icon: Trophy,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
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
      value: "3/5",
      trend: "60% complété",
      icon: CheckCircle2,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
  ];

  // Mock data for weekly heatmap
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const completionData = [100, 80, 100, 60, 0, 0, 0]; // 0 means not yet or missed

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
            
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-50 transition-all ${stat.bg.replace('/10', '')}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Analysis */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Analyse de la semaine</h2>
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
        <div id="tour-goal" className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Note du jour</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Prenez l'habitude de noter un bref bilan de votre journée.
          </p>
          <textarea 
            className="flex-1 bg-background border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none min-h-[150px]"
            placeholder="Qu'avez-vous accompli aujourd'hui ? Quelles sont les leçons apprises ?"
            defaultValue="Une journée productive. J'ai terminé les wireframes pour le client A et j'ai prospecté 3 nouvelles entreprises."
          ></textarea>
          <div className="mt-4 flex justify-end">
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors">
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
