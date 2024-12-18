import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

export interface User {
  id: string;
  name: string;
  email: string;
}

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

  async login(email: string, password: string): Promise<User> {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
    localStorage.setItem('token', data.token);
    return data.user;
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
