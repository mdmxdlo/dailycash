"use client";

import { useState } from "react";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Plus, TrendingUp, DollarSign, Wallet, Trash2, Receipt } from "lucide-react";
import { useStore, Revenue } from "@/store/useStore";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatCurrency } from "@/utils/currency";

const revenueSchema = z.object({
  client: z.string().min(2, "Le client est requis"),
  amount: z.number({ error: "Le montant doit être un nombre" }).min(0, "Le montant doit être positif"),
  date: z.string().min(1, "La date est requise"),
  status: z.enum(["Payé", "En attente", "Annulé"]),
  note: z.string().optional(),
});

type RevenueFormValues = z.infer<typeof revenueSchema>;

export default function RevenuePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const revenues = useStore((state) => state.revenues);
  const addRevenue = useStore((state) => state.addRevenue);
  const deleteRevenue = useStore((state) => state.deleteRevenue);
  const user = useStore((state) => state.user);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RevenueFormValues>({
    resolver: zodResolver(revenueSchema),
    defaultValues: {
      client: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      status: "Payé",
      note: "",
    }
  });

  const onSubmit = (data: RevenueFormValues) => {
    addRevenue(data);
    toast.success("Revenu ajouté avec succès");
    setIsModalOpen(false);
    reset();
  };

  const handleDelete = (id: number) => {
    deleteRevenue(id);
    toast.error("Revenu supprimé");
  };

  const totalRevenue = revenues.filter(r => r.status === "Payé").reduce((sum, item) => sum + item.amount, 0);
  const pendingRevenue = revenues.filter(r => r.status === "En attente").reduce((sum, item) => sum + item.amount, 0);

  const statusColors: Record<string, string> = {
    "Payé": "text-primary bg-primary/10 border-primary/20",
    "En attente": "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    "Annulé": "text-destructive bg-destructive/10 border-destructive/20",
  };

  return (
    <div id="tour-revenues" className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenus</h1>
          <p className="text-muted-foreground mt-1">
            Suivez vos encaissements et analysez votre croissance financière.
          </p>
        </div>
        <div className="flex gap-4">
          <select className="bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-muted-foreground hidden md:block">
            <option value="all">Toutes les périodes</option>
            <option value="mai-2026">Mai 2026</option>
            <option value="avr-2026">Avril 2026</option>
          </select>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Nouveau Revenu
          </button>
        </div>
      </div>

      {/* KPIs */}
      {revenues.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">Revenus Encaissés</h3>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue, user?.currency)}</p>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">Revenus en Attente</h3>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(pendingRevenue, user?.currency)}</p>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-all"></div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">Progression Objectif (500k)</h3>
            <p className="text-2xl font-bold text-foreground">{Math.min(100, Math.round((totalRevenue / 500000) * 100))}%</p>
            <div className="w-full bg-border/50 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (totalRevenue / 500000) * 100)}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {revenues.length > 0 && <RevenueChart />}

      {/* Table or Empty State */}
      {revenues.length === 0 ? (
        <EmptyState 
          icon={Receipt}
          title="Aucun revenu enregistré"
          description="Enregistrez vos premiers paiements ou acomptes pour suivre vos statistiques financières."
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
            >
              Ajouter un revenu
            </button>
          }
        />
      ) : (
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Historique des transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Client / Source</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 font-medium">Note</th>
                  <th className="px-6 py-4 font-medium text-right">Montant</th>
                  <th className="px-6 py-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {revenues.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(entry.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {entry.client}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${statusColors[entry.status]}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {entry.note || "-"}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-foreground whitespace-nowrap">
                      {formatCurrency(entry.amount, user?.currency)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDelete(entry.id)} className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-colors focus:outline-none">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Revenue */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Revenu">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Client / Source *</label>
            <input
              {...register("client")}
              type="text"
              placeholder="Ex: TechCorp SARL"
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
            {errors.client && <p className="text-destructive text-xs mt-1">{errors.client.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Montant ({user?.currency || "FCFA"}) *</label>
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
              {errors.amount && <p className="text-destructive text-xs mt-1">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Date *</label>
              <input
                {...register("date")}
                type="date"
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
              {errors.date && <p className="text-destructive text-xs mt-1">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Statut</label>
            <select
              {...register("status")}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            >
              <option value="Payé">Payé</option>
              <option value="En attente">En attente</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Note / Description</label>
            <textarea
              {...register("note")}
              placeholder="Ex: Acompte 30% pour le design"
              rows={3}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
            >
              Ajouter le revenu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
