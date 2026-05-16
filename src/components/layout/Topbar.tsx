"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

type SearchResult = {
  id: string;
  label: string;
  sub: string;
  href: string;
  category: "Tâches" | "Clients" | "Revenus";
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
};

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = useStore(state => state.user);
  const revenues = useStore(state => state.revenues);
  const tasks = useStore(state => state.tasks);
  const clients = useStore(state => state.clients);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setReadIds(JSON.parse(stored));
    } catch {}
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Search results
  const results = useMemo<SearchResult[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];

    const out: SearchResult[] = [];

    tasks
      .filter(t => t.text.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(t => out.push({
        id: `task-${t.id}`,
        label: t.text,
        sub: t.category,
        href: "/tasks",
        category: "Tâches",
        icon: CheckSquare,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
      }));

    clients
      .filter(c => c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(c => out.push({
        id: `client-${c.id}`,
        label: c.name,
        sub: c.status,
        href: "/clients",
        category: "Clients",
        icon: Users,
        iconColor: "text-violet-500",
        iconBg: "bg-violet-500/10",
      }));

    revenues
      .filter(r => r.client.toLowerCase().includes(q) || r.note?.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(r => out.push({
        id: `rev-${r.id}`,
        label: r.client,
        sub: `${r.amount.toLocaleString("fr-FR")} ${user?.currency ?? "FCFA"} · ${r.status}`,
        href: "/revenue",
        category: "Revenus",
        icon: Wallet,
        iconColor: "text-primary",
        iconBg: "bg-primary/10",
      }));

    return out;
  }, [searchQuery, tasks, clients, revenues, user?.currency]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && selectedIdx >= 0 && results[selectedIdx]) {
      router.push(results[selectedIdx].href);
      setSearchQuery("");
      setSearchOpen(false);
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
    }
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

  const markAllAsRead = () => {
    const allIds = ALL_NOTIFICATIONS.map(n => n.id);
    setReadIds(allIds);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds)); } catch {}
  };

  const notifications = ALL_NOTIFICATIONS.map(n => ({ ...n, read: readIds.includes(n.id) }));
  const unreadCount = notifications.filter(n => !n.read).length;

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

  // Group results by category for display
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.category] ??= []).push(r);
    return acc;
  }, {});

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

          {/* Universal search */}
          <div ref={searchRef} className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); setSelectedIdx(-1); }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher tâche, client, revenu…"
              className="bg-background border border-border/50 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all w-72"
            />

            {/* Search dropdown */}
            {searchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute top-11 left-0 w-96 bg-card border border-border/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Aucun résultat pour <span className="font-medium text-foreground">"{searchQuery}"</span></p>
                  </div>
                ) : (
                  <div className="py-2">
                    {Object.entries(grouped).map(([cat, items]) => (
                      <div key={cat}>
                        <p className="px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{cat}</p>
                        {items.map((r, i) => {
                          const globalIdx = results.indexOf(r);
                          return (
                            <Link
                              key={r.id}
                              href={r.href}
                              onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                              className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${selectedIdx === globalIdx ? "bg-primary/10" : "hover:bg-white/5"}`}
                            >
                              <div className={`p-1.5 rounded-lg ${r.iconBg} shrink-0`}>
                                <r.icon className={`w-3.5 h-3.5 ${r.iconColor}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{highlight(r.label, searchQuery)}</p>
                                <p className="text-xs text-muted-foreground truncate">{r.sub}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                    <div className="border-t border-border/50 px-4 py-2 mt-1">
                      <p className="text-xs text-muted-foreground">↑↓ naviguer · ↵ ouvrir · Échap fermer</p>
                    </div>
                  </div>
                )}
              </div>
            )}
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

            {/* Notification bell */}
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
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                    <span className="text-sm font-semibold">Notifications</span>
                    <div className="flex items-center gap-2">
                      <button onClick={markAllAsRead} className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                        Tout marquer comme lu
                      </button>
                      <Link href="/notifications" onClick={() => setIsNotifOpen(false)} className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5" title="Voir en grand">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5 ${notif.read ? "opacity-60" : "bg-primary/5"}`}>
                        <div className={`p-2 rounded-xl ${notif.bg} ${notif.color} shrink-0 mt-0.5`}>
                          <notif.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium leading-tight ${notif.read ? "text-foreground" : "text-primary"}`}>{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
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
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-card h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 flex items-center justify-between border-b border-border/50">
              <Link href="/" className="flex items-center gap-2 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-bold text-foreground">Daily Cash</span>
              </Link>
              <button className="text-muted-foreground hover:text-foreground bg-secondary rounded-full p-2 focus:outline-none" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile search */}
            <div className="px-4 pt-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-full bg-background border border-border/50 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              {searchQuery.trim().length >= 2 && (
                <div className="mt-2 bg-background border border-border/50 rounded-2xl overflow-hidden">
                  {results.length === 0 ? (
                    <p className="text-sm text-muted-foreground px-4 py-3">Aucun résultat</p>
                  ) : results.map(r => (
                    <Link key={r.id} href={r.href} onClick={() => { setSearchQuery(""); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors">
                      <div className={`p-1.5 rounded-lg ${r.iconBg} shrink-0`}>
                        <r.icon className={`w-3.5 h-3.5 ${r.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.category} · {r.sub}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isActive ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
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
