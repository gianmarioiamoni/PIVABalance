import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  name: string;
}

class AuthService {
  async signIn(credentials: SignInCredentials): Promise<{ token: string; user: User }> {
    try {
      const response = await api.post('/api/auth/login', credentials);
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<{ token: string; user: User }> {
    try {
      const response = await api.post('/api/auth/register', credentials);
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async checkAuth(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('token');
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  }
}

export const authService = new AuthService();
