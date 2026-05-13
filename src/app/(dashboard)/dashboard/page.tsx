import { StatCards } from "@/components/dashboard/StatCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { MonthlyGoal } from "@/components/dashboard/MonthlyGoal";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Voici un aperçu de vos performances financières et de votre discipline.
        </p>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <MonthlyGoal />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Passez à l&apos;action !</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Votre série de discipline est excellente. Continuez sur cette lancée pour atteindre vos objectifs du mois.
          </p>
          <Link href="/tasks" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Ajouter une tâche
          </Link>
        </div>
      </div>
    </div>
  );
}
