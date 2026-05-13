"use client";

import { useState } from "react";
import { Bell, CheckCircle2, DollarSign, Wallet } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Bienvenue sur Daily Cash ! 🚀",
      message: "Félicitations pour la création de votre compte. Vous êtes désormais équipé de l'outil ultime pour gérer vos revenus, suivre vos clients et optimiser votre discipline de freelance. Explorez le tableau de bord pour commencer !",
      time: "À l'instant",
      icon: CheckCircle2,
      color: "text-primary",
      bg: "bg-primary/10",
      read: false
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Restez informé de l'activité de votre compte.
          </p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Tout marquer comme lu
        </button>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-border/50">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-6 flex items-start gap-4 transition-colors hover:bg-white/5 ${notif.read ? 'opacity-70' : 'bg-primary/5'}`}>
              <div className={`p-3 rounded-xl ${notif.bg} ${notif.color} mt-1`}>
                <notif.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${notif.read ? 'text-foreground' : 'text-primary'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {notif.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
