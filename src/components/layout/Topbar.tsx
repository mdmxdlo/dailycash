"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Bell, Search, Menu, Download, X, Sun, Moon,
  LayoutDashboard, CheckSquare, Users, Wallet, CalendarDays, Settings, LogOut, Sparkles,
  CheckCircle2, ExternalLink
} from "lucide-react";
import { useStore } from "@/store/useStore";

const STORAGE_KEY = "daily-cash-read-notifications";

const ALL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Bienvenue sur Daily Cash ! 🚀",
    message: "Félicitations pour la création de votre compte. Explorez le tableau de bord pour commencer !",
    time: "À l'instant",
    icon: CheckCircle2,
    color: "text-primary",
    bg: "bg-primary/10",
  }
];

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const user = useStore(state => state.user);
  const revenues = useStore(state => state.revenues);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setReadIds(JSON.parse(stored));
    } catch {}
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const notifications = ALL_NOTIFICATIONS.map(n => ({ ...n, read: readIds.includes(n.id) }));
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    const allIds = ALL_NOTIFICATIONS.map(n => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    } catch {}
  };

  const handleExport = () => {
    const rows = [
      ["Date", "Client", "Montant", "Statut", "Note"],
      ...revenues.map(r => [r.date, r.client, r.amount, r.status, r.note || ""]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-cash-revenus-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const pathname = usePathname();

  const navItems = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tâches", href: "/tasks", icon: CheckSquare },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Revenus", href: "/revenue", icon: Wallet },
    { name: "Discipline", href: "/discipline", icon: CalendarDays },
    { name: "Paramètres", href: "/settings", icon: Settings },
  ];

  const displayDate = mounted ? today : "";

  return (
    <>
      <header className="h-20 border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="md:hidden flex items-center gap-2 text-primary font-bold text-lg">
             <Sparkles className="w-5 h-5" />
             <span>Daily Cash</span>
          </div>

          <div className="hidden md:block">
            <h1 className="text-xl font-bold">Bonjour, {user?.name.split(' ')[0]} !</h1>
            <p className="text-sm text-muted-foreground capitalize">{displayDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  alert("Résultats de recherche pour : " + searchQuery);
                  setSearchQuery("");
                }
              }}
              placeholder="Rechercher..."
              className="bg-background border border-border/50 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all w-64"
            />
          </div>

          <button onClick={handleExport} className="hidden md:flex items-center gap-2 text-sm font-medium bg-secondary text-secondary-foreground px-4 py-2 rounded-full hover:bg-secondary/80 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>

          <div className="flex items-center gap-3 md:gap-4 md:border-l md:border-border/50 md:pl-6">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-white/5 focus:outline-none"
            >
              {mounted && theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification bell + dropdown */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setIsNotifOpen(v => !v)}
                className="relative text-muted-foreground hover:text-foreground transition-colors p-1 focus:outline-none"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-card border border-border/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                    <span className="text-sm font-semibold">Notifications</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        Tout marquer comme lu
                      </button>
                      <Link
                        href="/notifications"
                        onClick={() => setIsNotifOpen(false)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                        title="Voir en grand"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Notifications list */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5 ${notif.read ? "opacity-60" : "bg-primary/5"}`}
                      >
                        <div className={`p-2 rounded-xl ${notif.bg} ${notif.color} shrink-0 mt-0.5`}>
                          <notif.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium leading-tight ${notif.read ? "text-foreground" : "text-primary"}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 focus:outline-none group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-[2px] group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-primary/30">
                <div className="w-full h-full rounded-full bg-card overflow-hidden">
                  <img
                    src={user?.avatar && user.avatar.length > 1 ? user.avatar : `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.avatar ?? 'default'}&backgroundColor=transparent`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative w-4/5 max-w-sm bg-card h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 flex items-center justify-between border-b border-border/50">
              <Link href="/" className="flex items-center gap-2 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-bold text-foreground">Daily Cash</span>
              </Link>
              <button
                className="text-muted-foreground hover:text-foreground bg-secondary rounded-full p-2 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
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

            <div className="p-6 border-t border-border/50">
              <button
                onClick={async () => {
                  const { createClient } = await import("@/utils/supabase/client");
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.href = '/login';
                }}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all text-muted-foreground hover:bg-white/5 hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
