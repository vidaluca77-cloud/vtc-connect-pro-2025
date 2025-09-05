// Types générés automatiquement pour Supabase
// Représentent la structure de la base de données VTC Connect Pro

export interface Database {
  public: {
    Tables: {
      // Table des profils utilisateurs (chauffeurs)
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          license_number: string | null;
          vehicle_type: string | null;
          vehicle_model: string | null;
          vehicle_plate: string | null;
          is_verified: boolean;
          is_active: boolean;
          subscription_plan: 'free' | 'basic' | 'premium';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          license_number?: string | null;
          vehicle_type?: string | null;
          vehicle_model?: string | null;
          vehicle_plate?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          subscription_plan?: 'free' | 'basic' | 'premium';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          license_number?: string | null;
          vehicle_type?: string | null;
          vehicle_model?: string | null;
          vehicle_plate?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          subscription_plan?: 'free' | 'basic' | 'premium';
          created_at?: string;
          updated_at?: string;
        };
      };
      // Table des courses
      rides: {
        Row: {
          id: string;
          driver_id: string;
          customer_name: string;
          customer_phone: string | null;
          pickup_address: string;
          destination_address: string;
          pickup_latitude: number | null;
          pickup_longitude: number | null;
          destination_latitude: number | null;
          destination_longitude: number | null;
          distance_km: number | null;
          duration_minutes: number | null;
          price: number;
          commission: number | null;
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          payment_method: 'cash' | 'card' | 'transfer';
          payment_status: 'pending' | 'paid' | 'failed';
          notes: string | null;
          scheduled_at: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          customer_name: string;
          customer_phone?: string | null;
          pickup_address: string;
          destination_address: string;
          pickup_latitude?: number | null;
          pickup_longitude?: number | null;
          destination_latitude?: number | null;
          destination_longitude?: number | null;
          distance_km?: number | null;
          duration_minutes?: number | null;
          price: number;
          commission?: number | null;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          payment_method: 'cash' | 'card' | 'transfer';
          payment_status?: 'pending' | 'paid' | 'failed';
          notes?: string | null;
          scheduled_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          customer_name?: string;
          customer_phone?: string | null;
          pickup_address?: string;
          destination_address?: string;
          pickup_latitude?: number | null;
          pickup_longitude?: number | null;
          destination_latitude?: number | null;
          destination_longitude?: number | null;
          distance_km?: number | null;
          duration_minutes?: number | null;
          price?: number;
          commission?: number | null;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          payment_method?: 'cash' | 'card' | 'transfer';
          payment_status?: 'pending' | 'paid' | 'failed';
          notes?: string | null;
          scheduled_at?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Table des finances
      financial_records: {
        Row: {
          id: string;
          driver_id: string;
          ride_id: string | null;
          type: 'income' | 'expense' | 'commission' | 'fuel' | 'maintenance';
          category: string;
          amount: number;
          description: string | null;
          receipt_url: string | null;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          ride_id?: string | null;
          type: 'income' | 'expense' | 'commission' | 'fuel' | 'maintenance';
          category: string;
          amount: number;
          description?: string | null;
          receipt_url?: string | null;
          date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          ride_id?: string | null;
          type?: 'income' | 'expense' | 'commission' | 'fuel' | 'maintenance';
          category?: string;
          amount?: number;
          description?: string | null;
          receipt_url?: string | null;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Table des posts communautaires
      community_posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          content: string;
          category: 'discussion' | 'tips' | 'question' | 'announcement';
          likes_count: number;
          replies_count: number;
          is_pinned: boolean;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content: string;
          category: 'discussion' | 'tips' | 'question' | 'announcement';
          likes_count?: number;
          replies_count?: number;
          is_pinned?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          category?: 'discussion' | 'tips' | 'question' | 'announcement';
          likes_count?: number;
          replies_count?: number;
          is_pinned?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Table des notifications
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          data: Record<string, any> | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          data?: Record<string, any> | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          data?: Record<string, any> | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      // Vues pour les statistiques
      driver_stats: {
        Row: {
          driver_id: string;
          total_rides: number;
          total_earnings: number;
          average_rating: number;
          total_distance: number;
        };
      };
    };
    Functions: {
      // Fonctions Supabase
      get_nearby_drivers: {
        Args: {
          lat: number;
          lng: number;
          radius_km: number;
        };
        Returns: {
          driver_id: string;
          distance_km: number;
        }[];
      };
    };
    Enums: {
      ride_status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
      payment_method: 'cash' | 'card' | 'transfer';
      payment_status: 'pending' | 'paid' | 'failed';
      subscription_plan: 'free' | 'basic' | 'premium';
      financial_record_type: 'income' | 'expense' | 'commission' | 'fuel' | 'maintenance';
      notification_type: 'info' | 'success' | 'warning' | 'error';
      post_category: 'discussion' | 'tips' | 'question' | 'announcement';
    };
    CompositeTypes: {
      // Types composites si nécessaires
      location: {
        latitude: number;
        longitude: number;
      };
    };
  };
}

// Types d'aide pour une utilisation plus facile
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Ride = Database['public']['Tables']['rides']['Row'];
export type FinancialRecord = Database['public']['Tables']['financial_records']['Row'];
export type CommunityPost = Database['public']['Tables']['community_posts']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

// Types pour les insertions
export type InsertProfile = Database['public']['Tables']['profiles']['Insert'];
export type InsertRide = Database['public']['Tables']['rides']['Insert'];
export type InsertFinancialRecord = Database['public']['Tables']['financial_records']['Insert'];
export type InsertCommunityPost = Database['public']['Tables']['community_posts']['Insert'];
export type InsertNotification = Database['public']['Tables']['notifications']['Insert'];

// Types pour les mises à jour
export type UpdateProfile = Database['public']['Tables']['profiles']['Update'];
export type UpdateRide = Database['public']['Tables']['rides']['Update'];
export type UpdateFinancialRecord = Database['public']['Tables']['financial_records']['Update'];
export type UpdateCommunityPost = Database['public']['Tables']['community_posts']['Update'];
export type UpdateNotification = Database['public']['Tables']['notifications']['Update'];

// Énumérations pour une utilisation facile
export type RideStatus = Database['public']['Enums']['ride_status'];
export type PaymentMethod = Database['public']['Enums']['payment_method'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type SubscriptionPlan = Database['public']['Enums']['subscription_plan'];
export type FinancialRecordType = Database['public']['Enums']['financial_record_type'];
export type NotificationType = Database['public']['Enums']['notification_type'];
export type PostCategory = Database['public']['Enums']['post_category'];
