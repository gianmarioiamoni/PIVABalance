import api from './api';
import { isAxiosError } from 'axios';

export interface YearlyContributions {
  _id?: string;
  year: number;
  previousYearContributions: number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class ContributionsService {
  private baseUrl = '/api/contributions';

  async getContributionsByYear(year: number): Promise<YearlyContributions> {
    try {
      const response = await api.get(`${this.baseUrl}/${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contributions:', error);
      // Return a default object if there's an error
      return {
        year,
        previousYearContributions: 0
      };
    }
  }

  async saveContributions(data: Omit<YearlyContributions, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<YearlyContributions> {
    try {
      const response = await api.post(this.baseUrl, {
        year: data.year,
        previousYearContributions: parseFloat(data.previousYearContributions.toString())
      });
      return response.data;
    } catch (error) {
      console.error('Error saving contributions:', error);
      throw error;
    }
  }

  async updateContributions(year: number, data: Partial<YearlyContributions>): Promise<YearlyContributions> {
    try {
      const response = await api.put(`${this.baseUrl}/${year}`, data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        // If not found, try to create new contributions
        return this.saveContributions({
          year,
          previousYearContributions: data.previousYearContributions || 0
        });
      }
      throw error;
    }
  }
}

export const contributionsService = new ContributionsService();
