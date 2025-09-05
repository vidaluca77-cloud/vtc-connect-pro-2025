import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Variables d'environnement Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
  throw new Error('Variable d\'environnement NEXT_PUBLIC_SUPABASE_URL manquante');
}

if (!supabaseAnonKey) {
  throw new Error('Variable d\'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY manquante');
}

// Créer le client Supabase avec typages
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    // Paramètres en temps réel pour les notifications push
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Export des types utiles
export type { Database } from './database.types';
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Helper functions pour les opérations communes
export const supabaseHelpers = {
  // Authentification
  auth: {
    signUp: (email: string, password: string) => 
      supabase.auth.signUp({ email, password }),
    signIn: (email: string, password: string) => 
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    getCurrentUser: () => supabase.auth.getUser(),
  },
  
  // Storage pour les fichiers
  storage: {
    uploadFile: (bucket: string, path: string, file: File) =>
      supabase.storage.from(bucket).upload(path, file),
    downloadFile: (bucket: string, path: string) =>
      supabase.storage.from(bucket).download(path),
    getPublicUrl: (bucket: string, path: string) =>
      supabase.storage.from(bucket).getPublicUrl(path),
    deleteFile: (bucket: string, path: string) =>
      supabase.storage.from(bucket).remove([path]),
  },
  
  // Utilitaires de formatage
  formatters: {
    formatDate: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
    formatDateTime: (date: string) => new Date(date).toLocaleString('fr-FR'),
    formatCurrency: (amount: number) => 
      new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount),
  },
};

export default supabase;
