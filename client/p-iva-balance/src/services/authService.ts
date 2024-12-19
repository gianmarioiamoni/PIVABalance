import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:5000/api';

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

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
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  async signIn(credentials: SignInCredentials): Promise<{ token: string; user: User }> {
    const response = await axiosInstance.post('/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
    localStorage.setItem('token', data.token);
    return data;
  }

  async signUp(credentials: SignUpCredentials): Promise<{ token: string; user: User }> {
    const response = await axiosInstance.post('/auth/register', credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
    localStorage.setItem('token', data.token);
    return data;
  }

  async checkAuth(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axiosInstance.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        localStorage.removeItem('token');
        return null;
      }

      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    
    try {
      await axiosInstance.post('/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
