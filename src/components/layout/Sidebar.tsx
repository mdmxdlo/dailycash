"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Wallet,
  CalendarDays,
  Settings,
  LogOut,
  Sparkles
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
    { name: "Tâches", href: "/tasks", icon: CheckSquare },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Revenus", href: "/revenue", icon: Wallet },
    { name: "Discipline", href: "/discipline", icon: CalendarDays },
    { name: "Paramètres", href: "/settings", icon: Settings },
  ];

  return (
    <aside id="tour-sidebar" className="w-64 border-r border-border/50 bg-card h-screen sticky top-0 flex flex-col justify-between hidden md:flex">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-10 text-primary">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">Daily Cash</span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all text-muted-foreground hover:bg-white/5 hover:text-destructive">
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
