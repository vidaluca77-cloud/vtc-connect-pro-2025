/**
 * API Client pour communiquer avec le backend Railway
 * Service VTC Connect Pro 2025
 */

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'client' | 'driver' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface Reservation {
  id: string;
  userId: string;
  driverId?: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDate: string;
  pickupTime: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  vehicleType: string;
  price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  vehicleInfo: {
    brand: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  isActive: boolean;
  rating: number;
  totalRides: number;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    // URL de base Railway - à configurer selon votre déploiement
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vtc-connect-pro-backend.railway.app';
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP Error: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'client' | 'driver';
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    await this.request('/api/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.request<{ token: string }>('/api/auth/refresh', {
      method: 'POST',
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // User Management
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/api/users/me');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.request<void>('/api/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Reservations
  async createReservation(reservationData: Omit<Reservation, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Reservation>> {
    return this.request<Reservation>('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  }

  async getReservations(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ reservations: Reservation[]; total: number; page: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/api/reservations${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  async getReservation(id: string): Promise<ApiResponse<Reservation>> {
    return this.request<Reservation>(`/api/reservations/${id}`);
  }

  async updateReservation(id: string, updates: Partial<Reservation>): Promise<ApiResponse<Reservation>> {
    return this.request<Reservation>(`/api/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async cancelReservation(id: string): Promise<ApiResponse<Reservation>> {
    return this.request<Reservation>(`/api/reservations/${id}/cancel`, {
      method: 'POST',
    });
  }

  // Driver specific
  async acceptReservation(reservationId: string): Promise<ApiResponse<Reservation>> {
    return this.request<Reservation>(`/api/reservations/${reservationId}/accept`, {
      method: 'POST',
    });
  }

  async startRide(reservationId: string): Promise<ApiResponse<Reservation>> {
    return this.request<Reservation>(`/api/reservations/${reservationId}/start`, {
      method: 'POST',
    });
  }

  async completeRide(reservationId: string): Promise<ApiResponse<Reservation>> {
    return this.request<Reservation>(`/api/reservations/${reservationId}/complete`, {
      method: 'POST',
    });
  }

  // Driver Management
  async getDriverProfile(): Promise<ApiResponse<Driver>> {
    return this.request<Driver>('/api/drivers/me');
  }

  async updateDriverProfile(driverData: Partial<Driver>): Promise<ApiResponse<Driver>> {
    return this.request<Driver>('/api/drivers/me', {
      method: 'PUT',
      body: JSON.stringify(driverData),
    });
  }

  async getAvailableReservations(): Promise<ApiResponse<Reservation[]>> {
    return this.request<Reservation[]>('/api/drivers/available-reservations');
  }

  async updateDriverLocation(latitude: number, longitude: number): Promise<ApiResponse<void>> {
    return this.request<void>('/api/drivers/location', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude }),
    });
  }

  async setDriverAvailability(isAvailable: boolean): Promise<ApiResponse<Driver>> {
    return this.request<Driver>('/api/drivers/availability', {
      method: 'PUT',
      body: JSON.stringify({ isAvailable }),
    });
  }

  // Pricing
  async calculatePrice(pickupAddress: string, destinationAddress: string, vehicleType: string): Promise<ApiResponse<{ price: number; distance: number; duration: number }>> {
    return this.request('/api/pricing/calculate', {
      method: 'POST',
      body: JSON.stringify({ pickupAddress, destinationAddress, vehicleType }),
    });
  }

  // Admin specific
  async getAllUsers(params?: { role?: string; page?: number; limit?: number }): Promise<ApiResponse<{ users: User[]; total: number; page: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/api/admin/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  async getAllReservations(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<{ reservations: Reservation[]; total: number; page: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/api/admin/reservations${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  async getAllDrivers(params?: { isActive?: boolean; page?: number; limit?: number }): Promise<ApiResponse<{ drivers: Driver[]; total: number; page: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/api/admin/drivers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  // Token Management
  private setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return this.token !== null;
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export types for use in components
export type { User, Reservation, Driver, ApiResponse };
