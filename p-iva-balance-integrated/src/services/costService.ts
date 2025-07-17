import { api } from './api';

/**
 * Cost interface for API responses
 */
export interface Cost {
  id: string;
  description: string;
  date: string;
  amount: number;
  deductible: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cost creation data interface
 */
export interface CreateCostData {
  description: string;
  date: string;
  amount: number;
  deductible: boolean;
}

/**
 * Cost update data interface
 */
export interface UpdateCostData {
  description?: string;
  date?: string;
  amount?: number;
  deductible?: boolean;
}

/**
 * Enhanced Cost Service for Next.js API Routes
 * 
 * Replaces the old Express backend cost management with Next.js API Routes.
 * Uses JWT authentication and follows the new ApiResponse format.
 * 
 * Features:
 * - TypeScript strict typing (zero 'any')
 * - JWT authentication integration
 * - Error handling and validation
 * - Integration with new API client
 * - SOLID principles adherence
 */
class CostService {
  /**
   * Get costs by year
   * Uses GET /api/costs?year={year} endpoint
   */
  async getCostsByYear(year: number): Promise<Cost[]> {
    try {
      const costs = await api.get<Cost[]>(`/costs?year=${year}`);
      return costs;
    } catch (error) {
      console.error('Error fetching costs:', error);
      throw error;
    }
  }

  /**
   * Get all costs for the authenticated user
   * Uses GET /api/costs endpoint
   */
  async getAllCosts(): Promise<Cost[]> {
    try {
      const costs = await api.get<Cost[]>('/costs');
      return costs;
    } catch (error) {
      console.error('Error fetching all costs:', error);
      throw error;
    }
  }

  /**
   * Get a specific cost by ID
   * Uses GET /api/costs/{id} endpoint
   */
  async getCostById(id: string): Promise<Cost> {
    try {
      const cost = await api.get<Cost>(`/costs/${id}`);
      return cost;
    } catch (error) {
      console.error('Error fetching cost:', error);
      throw error;
    }
  }

  /**
   * Create a new cost
   * Uses POST /api/costs endpoint
   */
  async createCost(data: CreateCostData): Promise<Cost> {
    try {
      const cost = await api.post<Cost>('/costs', {
        ...data,
        deductible: data.deductible ?? true, // Default to deductible
      });
      return cost;
    } catch (error) {
      console.error('Error creating cost:', error);
      throw error;
    }
  }

  /**
   * Update an existing cost
   * Uses PUT /api/costs/{id} endpoint
   */
  async updateCost(id: string, data: UpdateCostData): Promise<Cost> {
    try {
      const cost = await api.put<Cost>(`/costs/${id}`, data);
      return cost;
    } catch (error) {
      console.error('Error updating cost:', error);
      throw error;
    }
  }

  /**
   * Delete a cost
   * Uses DELETE /api/costs/{id} endpoint
   */
  async deleteCost(id: string): Promise<void> {
    try {
      await api.delete(`/costs/${id}`);
    } catch (error) {
      console.error('Error deleting cost:', error);
      throw error;
    }
  }

  /**
   * Calculate total costs for a year
   * Client-side calculation helper
   */
  calculateYearTotal(costs: Cost[], year: number): number {
    return costs
      .filter(cost => new Date(cost.date).getFullYear() === year)
      .reduce((total, cost) => total + cost.amount, 0);
  }

  /**
   * Calculate deductible costs for a year
   * Client-side calculation helper
   */
  calculateDeductibleTotal(costs: Cost[], year: number): number {
    return costs
      .filter(cost => 
        cost.deductible && 
        new Date(cost.date).getFullYear() === year
      )
      .reduce((total, cost) => total + cost.amount, 0);
  }

  /**
   * Filter costs by date range
   * Client-side filtering helper
   */
  filterByDateRange(
    costs: Cost[], 
    startDate: string, 
    endDate: string
  ): Cost[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return costs.filter(cost => {
      const costDate = new Date(cost.date);
      return costDate >= start && costDate <= end;
    });
  }

  /**
   * Group costs by month
   * Client-side grouping helper
   */
  groupByMonth(costs: Cost[], year: number): Record<string, Cost[]> {
    const yearCosts = costs.filter(
      cost => new Date(cost.date).getFullYear() === year
    );

    return yearCosts.reduce((groups, cost) => {
      const month = new Date(cost.date).toISOString().substring(0, 7); // YYYY-MM
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(cost);
      return groups;
    }, {} as Record<string, Cost[]>);
  }

  /**
   * Validate cost data
   * Client-side validation helper
   */
  validateCostData(data: CreateCostData | UpdateCostData): string[] {
    const errors: string[] = [];

    if ('description' in data) {
      if (!data.description || data.description.trim().length === 0) {
        errors.push('Descrizione richiesta');
      }
      if (data.description && data.description.length > 200) {
        errors.push('Descrizione troppo lunga (max 200 caratteri)');
      }
    }

    if ('amount' in data) {
      if (data.amount === undefined || data.amount <= 0) {
        errors.push('Importo deve essere maggiore di zero');
      }
      if (data.amount && data.amount > 999999.99) {
        errors.push('Importo troppo elevato');
      }
    }

    if ('date' in data) {
      if (!data.date) {
        errors.push('Data richiesta');
      } else {
        const date = new Date(data.date);
        if (isNaN(date.getTime())) {
          errors.push('Data non valida');
        }
        // Check if date is too far in the future
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        if (date > maxDate) {
          errors.push('Data non può essere superiore a un anno nel futuro');
        }
      }
    }

    return errors;
  }
}

/**
 * Global cost service instance
 * Singleton pattern for consistent state management
 */
export const costService = new CostService();
