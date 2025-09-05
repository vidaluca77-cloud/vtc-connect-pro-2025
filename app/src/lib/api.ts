/**
 * API Client for VTC Connect Pro
 * Centralized API client with Clerk authentication and error handling
 */

import { useAuth } from '@clerk/nextjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vtc-connect-pro-backend-production.up.railway.app';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface User {
  id: string;
  clerkId?: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  vtcLicense?: string;
  driverProfile?: {
    experience?: string;
    rating?: number;
    totalTrips?: number;
    status?: string;
  };
}

interface ClerkUser {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
}

interface DashboardData {
  user: User;
  stats: {
    today: {
      rides: number;
      earnings: number;
      hours: number;
      avgRating: number;
    };
    week: {
      rides: number;
      earnings: number;
      hours: number;
    };
    month: {
      rides: number;
      earnings: number;
      hours: number;
    };
  };
  recentRides: Array<{
    id: string;
    date: string;
    from: string;
    to: string;
    amount: number;
    status: string;
  }>;
  upcomingRides: Array<{
    id: string;
    date: string;
    from: string;
    to: string;
    amount: number;
    status: string;
  }>;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
  icon: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  experience: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: string;
  isPinned?: boolean;
  isLiked?: boolean;
  tags?: string[];
}

interface CommunityData {
  posts: Post[];
  pagination: {
    page: number;
    totalPages: number;
    totalPosts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface Driver {
  id: string;
  name: string;
  avatar: string;
  experience: string;
  rating: number;
  trips: number;
  status: string;
  lastSeen?: string;
}

interface DriversData {
  onlineDrivers: Driver[];
  allDrivers: Driver[];
  stats: {
    totalMembers: number;
    onlineNow: number;
    postsToday: number;
  };
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  category: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

interface Ride {
  id: string;
  pickupLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  dropoffLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  scheduledDateTime: string;
  status: string;
  fare: {
    totalAmount: number;
  };
  passengerInfo: {
    name: string;
  };
}

interface PostData {
  content: string;
  category: string;
}

interface TransactionData {
  amount: number;
  type: string;
  description: string;
  category: string;
  paymentMethod: string;
}

interface RideData {
  pickupLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  dropoffLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  scheduledDateTime: Date;
  passengerInfo: {
    name: string;
    phone: string;
    passengers: number;
  };
  fare: {
    basePrice: number;
    distance: number;
    duration: number;
    totalAmount: number;
  };
  vehicle: {
    type: string;
    make: string;
    model: string;
    licensePlate: string;
  };
  paymentMethod: string;
}

interface RideUpdate {
  status?: string;
  actualStartTime?: Date;
  actualEndTime?: Date;
  fare?: Partial<RideData['fare']>;
  rating?: {
    score: number;
    comment?: string;
  };
}

class ApiClient {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}/api${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(token),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // Auth endpoints
  auth = {
    me: (token: string) => this.request('/auth/me', { method: 'GET' }, token),
    
    syncClerkUser: (token: string, clerkUser: ClerkUser) =>
      this.request('/auth/clerk-sync', {
        method: 'POST',
        body: JSON.stringify({
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        }),
      }, token),
  };

  // Dashboard endpoints
  dashboard = {
    getStats: (token: string) => this.request('/dashboard', { method: 'GET' }, token),
    
    getActivity: (token: string) => this.request('/dashboard/activity', { method: 'GET' }, token),
    
    getChartData: (token: string) => this.request('/dashboard/stats', { method: 'GET' }, token),
  };

  // Community endpoints
  community = {
    getPosts: (token: string) => this.request('/community/posts', { method: 'GET' }, token),
    
    createPost: (token: string, post: PostData) =>
      this.request('/community/posts', {
        method: 'POST',
        body: JSON.stringify(post),
      }, token),
    
    getDrivers: (token: string) => this.request('/community/drivers', { method: 'GET' }, token),
    
    likePost: (token: string, postId: string) =>
      this.request(`/community/posts/${postId}/like`, { method: 'POST' }, token),
  };

  // Transactions endpoints
  transactions = {
    getAll: (token: string) => this.request('/transactions', { method: 'GET' }, token),
    
    create: (token: string, transaction: TransactionData) =>
      this.request('/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
      }, token),
  };

  // Rides endpoints
  rides = {
    getAll: (token: string) => this.request('/rides', { method: 'GET' }, token),
    
    create: (token: string, ride: RideData) =>
      this.request('/rides', {
        method: 'POST',
        body: JSON.stringify(ride),
      }, token),
    
    update: (token: string, rideId: string, updates: RideUpdate) =>
      this.request(`/rides/${rideId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }, token),
  };
}

export const api = new ApiClient();

// Hook for using API with automatic Clerk token
export function useApi() {
  const { getToken } = useAuth();

  const apiWithAuth = {
    auth: {
      me: async (): Promise<ApiResponse<{ user: User }>> => {
        const token = await getToken();
        return token ? (api.auth.me(token) as Promise<ApiResponse<{ user: User }>>) : { success: false, error: 'No token' };
      },
      syncClerkUser: async (clerkUser: ClerkUser): Promise<ApiResponse<{ user: User }>> => {
        const token = await getToken();
        return token ? (api.auth.syncClerkUser(token, clerkUser) as Promise<ApiResponse<{ user: User }>>) : { success: false, error: 'No token' };
      },
    },
    dashboard: {
      getStats: async (): Promise<ApiResponse<DashboardData>> => {
        const token = await getToken();
        return token ? (api.dashboard.getStats(token) as Promise<ApiResponse<DashboardData>>) : { success: false, error: 'No token' };
      },
      getActivity: async (): Promise<ApiResponse<Activity[]>> => {
        const token = await getToken();
        return token ? (api.dashboard.getActivity(token) as Promise<ApiResponse<Activity[]>>) : { success: false, error: 'No token' };
      },
      getChartData: async (): Promise<ApiResponse<unknown>> => {
        const token = await getToken();
        return token ? api.dashboard.getChartData(token) : { success: false, error: 'No token' };
      },
    },
    community: {
      getPosts: async (): Promise<ApiResponse<CommunityData>> => {
        const token = await getToken();
        return token ? (api.community.getPosts(token) as Promise<ApiResponse<CommunityData>>) : { success: false, error: 'No token' };
      },
      createPost: async (post: PostData): Promise<ApiResponse<Post>> => {
        const token = await getToken();
        return token ? (api.community.createPost(token, post) as Promise<ApiResponse<Post>>) : { success: false, error: 'No token' };
      },
      getDrivers: async (): Promise<ApiResponse<DriversData>> => {
        const token = await getToken();
        return token ? (api.community.getDrivers(token) as Promise<ApiResponse<DriversData>>) : { success: false, error: 'No token' };
      },
      likePost: async (postId: string): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> => {
        const token = await getToken();
        return token ? (api.community.likePost(token, postId) as Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>>) : { success: false, error: 'No token' };
      },
    },
    transactions: {
      getAll: async (): Promise<ApiResponse<Transaction[]>> => {
        const token = await getToken();
        return token ? (api.transactions.getAll(token) as Promise<ApiResponse<Transaction[]>>) : { success: false, error: 'No token' };
      },
      create: async (transaction: TransactionData): Promise<ApiResponse<Transaction>> => {
        const token = await getToken();
        return token ? (api.transactions.create(token, transaction) as Promise<ApiResponse<Transaction>>) : { success: false, error: 'No token' };
      },
    },
    rides: {
      getAll: async (): Promise<ApiResponse<Ride[]>> => {
        const token = await getToken();
        return token ? (api.rides.getAll(token) as Promise<ApiResponse<Ride[]>>) : { success: false, error: 'No token' };
      },
      create: async (ride: RideData): Promise<ApiResponse<Ride>> => {
        const token = await getToken();
        return token ? (api.rides.create(token, ride) as Promise<ApiResponse<Ride>>) : { success: false, error: 'No token' };
      },
      update: async (rideId: string, updates: RideUpdate): Promise<ApiResponse<Ride>> => {
        const token = await getToken();
        return token ? (api.rides.update(token, rideId, updates) as Promise<ApiResponse<Ride>>) : { success: false, error: 'No token' };
      },
    },
  };

  return apiWithAuth;
}

export default api;