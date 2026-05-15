import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { CurrencyType } from '@/utils/currency';

export type Task = {
  id: number;
  user_id: string;
  text: string;
  completed: boolean;
  category: "Prospection" | "Production" | "Contenu" | "Apprentissage";
  status: "todo" | "in-progress" | "done";
};

export type Client = {
  id: number;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  status: "Prospect" | "Contacté" | "En discussion" | "Client";
  amount: number;
};

export type Revenue = {
  id: number;
  user_id: string;
  client: string;
  amount: number;
  date: string;
  status: "Payé" | "En attente" | "Annulé";
  note?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  goal: number;
  currency: CurrencyType;
  is_pro: boolean;
  pro_expires_at: string | null;
};

type State = {
  tasks: Task[];
  clients: Client[];
  revenues: Revenue[];
  user: UserProfile | null;
  isInitialized: boolean;
};

type Actions = {
  fetchData: (userId: string) => Promise<void>;
  clearData: () => void;
  
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'completed' | 'status'>, userId: string) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  reorderTasks: (tasks: Task[]) => void; // local only for now

  // Clients
  addClient: (client: Omit<Client, 'id' | 'user_id'>, userId: string) => Promise<void>;
  updateClient: (id: number, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;

  // Revenues
  addRevenue: (revenue: Omit<Revenue, 'id' | 'user_id'>, userId: string) => Promise<void>;
  updateRevenue: (id: number, updates: Partial<Revenue>) => Promise<void>;
  deleteRevenue: (id: number) => Promise<void>;

  // User
  updateUser: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
};

const supabase = createClient();

export const useStore = create<State & Actions>()((set, get) => ({
  tasks: [],
  clients: [],
  revenues: [],
  user: null,
  isInitialized: false,

  fetchData: async (userId: string) => {
    try {
      const [tasksRes, clientsRes, revenuesRes, profileRes] = await Promise.all([
        supabase.from('tasks').select('*').eq('user_id', userId).order('id', { ascending: true }),
        supabase.from('clients').select('*').eq('user_id', userId).order('id', { ascending: true }),
        supabase.from('revenues').select('*').eq('user_id', userId).order('id', { ascending: true }),
        supabase.from('profiles').select('*').eq('id', userId).single(),
      ]);

      set({
        tasks: tasksRes.data || [],
        clients: clientsRes.data || [],
        revenues: revenuesRes.data || [],
        user: profileRes.data || null,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Erreur lors du chargement de vos données.");
    }
  },

  clearData: () => {
    set({ tasks: [], clients: [], revenues: [], user: null, isInitialized: false });
  },

  // Tasks
  addTask: async (task, userId) => {
    const newTask = { ...task, user_id: userId, completed: false, status: "todo" };
    const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
    if (error) {
      toast.error("Erreur lors de l'ajout de la tâche.");
      return;
    }
    set((state) => ({ tasks: [...state.tasks, data] }));
  },
  
  updateTask: async (id, updates) => {
    // Optimistic update
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));

    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (error) {
      toast.error("Erreur de sauvegarde.");
      set({ tasks: previousTasks }); // revert
    }
  },
  
  deleteTask: async (id) => {
    const previousTasks = get().tasks;
    set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
    
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      toast.error("Erreur lors de la suppression.");
      set({ tasks: previousTasks }); // revert
    }
  },
  
  reorderTasks: (tasks) => set({ tasks }),

  // Clients
  addClient: async (client, userId) => {
    const newClient = { ...client, user_id: userId };
    const { data, error } = await supabase.from('clients').insert(newClient).select().single();
    if (error) {
      toast.error("Erreur lors de l'ajout du client.");
      return;
    }
    set((state) => ({ clients: [...state.clients, data] }));
  },

  updateClient: async (id, updates) => {
    const previous = get().clients;
    set((state) => ({ clients: state.clients.map(c => c.id === id ? { ...c, ...updates } : c) }));
    const { error } = await supabase.from('clients').update(updates).eq('id', id);
    if (error) {
      toast.error("Erreur de sauvegarde.");
      set({ clients: previous });
    }
  },

  deleteClient: async (id) => {
    const previous = get().clients;
    set((state) => ({ clients: state.clients.filter(c => c.id !== id) }));
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) {
      toast.error("Erreur lors de la suppression.");
      set({ clients: previous });
    }
  },

  // Revenues
  addRevenue: async (revenue, userId) => {
    const newRevenue = { ...revenue, user_id: userId };
    const { data, error } = await supabase.from('revenues').insert(newRevenue).select().single();
    if (error) {
      toast.error("Erreur lors de l'ajout du revenu.");
      return;
    }
    set((state) => ({ revenues: [...state.revenues, data] }));
  },

  updateRevenue: async (id, updates) => {
    const previous = get().revenues;
    set((state) => ({ revenues: state.revenues.map(r => r.id === id ? { ...r, ...updates } : r) }));
    const { error } = await supabase.from('revenues').update(updates).eq('id', id);
    if (error) {
      toast.error("Erreur de sauvegarde.");
      set({ revenues: previous });
    }
  },

  deleteRevenue: async (id) => {
    const previous = get().revenues;
    set((state) => ({ revenues: state.revenues.filter(r => r.id !== id) }));
    const { error } = await supabase.from('revenues').delete().eq('id', id);
    if (error) {
      toast.error("Erreur lors de la suppression.");
      set({ revenues: previous });
    }
  },

  // User
  updateUser: async (userId, updates) => {
    const previous = get().user;
    set((state) => ({ user: state.user ? { ...state.user, ...updates } : null }));
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (error) {
      toast.error("Erreur de sauvegarde du profil.");
      set({ user: previous });
    }
  },
}));
