import api from './api';

export interface Cost {
  _id: string;
  description: string;
  date: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCostData {
  description: string;
  date: string;
  amount: number;
}

class CostService {
  async getCostsByYear(year: number): Promise<Cost[]> {
    try {
      const response = await api.get(`/api/costs/year/${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching costs:', error);
      throw error;
    }
  }

  async createCost(data: CreateCostData): Promise<Cost> {
    try {
      const response = await api.post('/api/costs', data);
      return response.data;
    } catch (error) {
      console.error('Error creating cost:', error);
      throw error;
    }
  }

  async updateCost(id: string, data: CreateCostData): Promise<Cost> {
    try {
      const response = await api.put(`/api/costs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating cost:', error);
      throw error;
    }
  }

  async deleteCost(id: string): Promise<void> {
    try {
      await api.delete(`/api/costs/${id}`);
    } catch (error) {
      console.error('Error deleting cost:', error);
      throw error;
    }
  }
}

export const costService = new CostService();
