"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatCurrency } from "@/utils/currency";
import { Search, Plus, Briefcase, DollarSign, Trash2, Users } from "lucide-react";
import { useStore, Client } from "@/store/useStore";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "sonner";

const clientSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").or(z.literal("")),
  phone: z.string().optional(),
  status: z.enum(["Prospect", "Contacté", "En discussion", "Client"]),
  amount: z.number({ error: "Le montant doit être un nombre" }).min(0, "Le montant doit être positif"),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const clients = useStore((state) => state.clients);
  const user = useStore((state) => state.user);
  const addClient = useStore((state) => state.addClient);
  const deleteClient = useStore((state) => state.deleteClient);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "Prospect",
      amount: 0,
    }
  });

  const onSubmit = (data: ClientFormValues) => {
    if (!user) return;
    addClient({ ...data, phone: data.phone ?? "" }, user.id);
    toast.success("Client ajouté avec succès");
    setIsModalOpen(false);
    reset();
  };

  const handleDeleteClient = (id: number) => {
    deleteClient(id);
    toast.error("Client supprimé");
  };

  const filteredClients = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const statusColors: Record<string, string> = {
    "Prospect": "text-purple-500 bg-purple-500/10 border-purple-500/20",
    "Contacté": "text-blue-500 bg-blue-500/10 border-blue-500/20",
    "En discussion": "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    "Client": "text-primary bg-primary/10 border-primary/20",
  };

  const totalPipeline = clients.filter(c => c.status !== "Client").reduce((acc, c) => acc + c.amount, 0);
  const closedRevenue = clients.filter(c => c.status === "Client").reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients & Prospects</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre base de contacts et suivez votre pipeline commercial.
          </p>
        </div>
      </div>

      {/* KPIs */}
      {clients.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm flex items-center gap-3 sm:gap-4 group relative overflow-hidden">
            <div className="p-3 sm:p-4 bg-purple-500/10 rounded-xl text-purple-500 shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pipeline Total</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-1 truncate">{formatCurrency(totalPipeline, user?.currency)}</p>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-sm flex items-center gap-3 sm:gap-4 group relative overflow-hidden">
            <div className="p-3 sm:p-4 bg-primary/10 rounded-xl text-primary shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Revenus Fermés</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground mt-1 truncate">{formatCurrency(closedRevenue, user?.currency)}</p>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card border border-border/50 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border/50 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        <button
          id="tour-add-client"
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Nouveau Client
        </button>
      </div>

      {/* Table or Empty State */}
      {clients.length === 0 ? (
        <EmptyState 
          icon={Users}
          title="Aucun client pour le moment"
          description="Commencez à construire votre portefeuille client en ajoutant votre premier prospect ou client."
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
            >
              Ajouter un client
            </button>
          }
        />
      ) : (
        <div id="tour-crm" className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Nom</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Montant (Est.)</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {client.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">{client.email || "-"}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{client.phone || "-"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full border ${statusColors[client.status]}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatCurrency(client.amount, user?.currency)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDeleteClient(client.id)} className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-colors focus:outline-none">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && search && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Aucun client trouvé pour "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Add Client */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Client">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Nom du client / entreprise *</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Ex: TechCorp SARL"
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="contact@email.com"
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
              <input
                {...register("phone")}
                type="text"
                placeholder="+225..."
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Statut</label>
              <select
                {...register("status")}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              >
                <option value="Prospect">Prospect</option>
                <option value="Contacté">Contacté</option>
                <option value="En discussion">En discussion</option>
                <option value="Client">Client</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Montant estimé ({user?.currency || "FCFA"})</label>
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
              {errors.amount && <p className="text-destructive text-xs mt-1">{errors.amount.message}</p>}
            </div>
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
              Ajouter le client
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
