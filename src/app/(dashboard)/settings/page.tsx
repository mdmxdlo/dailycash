"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Save, LogOut, ShieldAlert, User, Bell, Globe, Upload } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profil"); // "profil", "preferences", "notifications"
  const user = useStore(state => state.user);
  const updateUser = useStore(state => state.updateUser);

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [goal, setGoal] = useState(user?.goal?.toString() || "0");
  const [currency, setCurrency] = useState(user?.currency || "FCFA");
  const [showCurrencyWarning, setShowCurrencyWarning] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar?.length > 1 ? user?.avatar : `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.avatar || '1'}&backgroundColor=transparent`
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setGoal(user.goal.toString());
      setCurrency(user.currency || "FCFA");
      setAvatarUrl(user.avatar.length > 1 ? user.avatar : `https://api.dicebear.com/7.x/notionists/svg?seed=${user.avatar}&backgroundColor=transparent`);
    }
  }, [user]);

  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatars = ["Felix", "Jasmine", "Alexander", "Mia"];

  const handleSave = () => {
    if (!user) return;
    updateUser(user.id, {
      name,
      email,
      goal: Number(goal),
      currency: currency as any,
      // we only save the seed if it's a generated avatar, else the base64 URL
      avatar: avatarUrl.startsWith('https://api.dicebear.com') 
        ? avatarUrl.split('seed=')[1].split('&')[0] 
        : avatarUrl
    });
    toast.success("Vos modifications ont été enregistrées avec succès !");
  };

  const handleLogout = () => {
    toast.info("Déconnexion simulée avec succès.");
  };

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est simulée.")) {
      toast.error("Compte supprimé ! (simulation)");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations personnelles et les préférences de votre compte.
        </p>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="flex flex-col space-y-1 md:col-span-1">
          <button 
            onClick={() => setActiveTab("profil")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === "profil" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
          >
            <User className="w-4 h-4" />
            Profil
          </button>
          <button 
            onClick={() => setActiveTab("preferences")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === "preferences" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
          >
            <Globe className="w-4 h-4" />
            Préférences
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === "notifications" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Profile Section */}
          {activeTab === "profil" && (
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-semibold mb-6">Informations Publiques</h2>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-card overflow-hidden">
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-secondary text-secondary-foreground rounded-full border border-border shadow-sm hover:bg-secondary/80 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-sm font-medium text-foreground">Photo de profil</p>
                    <p className="text-xs text-muted-foreground mt-1">Téléchargez une image ou choisissez un avatar ci-dessous.</p>
                  </div>
                  <div className="flex gap-2">
                    {avatars.map((seed) => (
                      <button 
                        key={seed}
                        onClick={() => setAvatarUrl(`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=transparent`)}
                        className="w-10 h-10 rounded-full border border-border bg-card overflow-hidden hover:border-primary transition-colors focus:outline-none"
                      >
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=transparent`} alt={seed} />
                      </button>
                    ))}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 rounded-full border border-border border-dashed flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Prénom & Nom</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSave}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm shadow-primary/20"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {/* Preferences Section */}
          {activeTab === "preferences" && (
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-semibold mb-6">Préférences Financières</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Objectif Mensuel</label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-muted-foreground font-medium">{currency}</span>
                    <input
                      type="number"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-xl pl-20 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cet objectif sera utilisé pour calculer votre barre de progression sur le tableau de bord.
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  <label className="text-sm font-medium text-muted-foreground">Devise principale</label>
                  <select 
                    value={currency} 
                    onChange={(e) => {
                      if (e.target.value !== currency) {
                        setPendingCurrency(e.target.value);
                        setShowCurrencyWarning(true);
                      }
                    }}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  >
                    <option value="FCFA">Franc CFA (FCFA)</option>
                    <option value="GNF">Franc Guinéen (GNF)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar Américain ($)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cette devise sera affichée sur l'ensemble de vos tableaux de bord.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSave}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm shadow-primary/20"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab Placeholder */}
          {activeTab === "notifications" && (
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-semibold mb-6">Préférences de Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Choisissez comment vous souhaitez être alerté.
              </p>
              
              <div className="space-y-4 mt-6">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary" />
                  <span className="text-sm">M'alerter lorsqu'une tâche est en retard</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary" />
                  <span className="text-sm">Recevoir un résumé hebdomadaire par email</span>
                </label>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSave}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm shadow-primary/20"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 mt-8">
            <div className="flex items-center gap-2 text-destructive mb-4">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Zone Dangereuse</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière possible. Soyez certain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleLogout}
                className="bg-secondary text-secondary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 border border-border"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
              <button 
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground px-6 py-2 rounded-xl text-sm font-medium hover:bg-destructive/90 transition-colors shadow-sm shadow-destructive/20"
              >
                Supprimer le compte
              </button>
            </div>
          </div>

        </div>
      </div>

      <Modal 
        isOpen={showCurrencyWarning} 
        onClose={() => setShowCurrencyWarning(false)} 
        title="⚠️ Changement de devise"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            Le changement de devise modifie <span className="font-semibold text-primary">uniquement le symbole affiché</span>.
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-sm text-yellow-600 dark:text-yellow-500">
            Vos montants existants ne seront pas convertis mathématiquement (ex: 100 FCFA deviendra 100 €).
          </div>
          <p className="text-sm text-muted-foreground">
            Ne changez de devise que si vous avez fait une erreur lors de l'inscription ou si vous démarrez avec un nouveau compte.
          </p>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-border/50">
            <button 
              onClick={() => setShowCurrencyWarning(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={() => {
                setCurrency(pendingCurrency);
                setShowCurrencyWarning(false);
              }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Confirmer le changement
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
