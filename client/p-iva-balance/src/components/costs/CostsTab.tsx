import React, { useState, useEffect } from 'react';
import { Cost, costService } from '@/services/costService';
import CostForm from './CostForm';
import CostList from './CostList';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface CostsTabProps {
  selectedYear: number;
}

export const CostsTab: React.FC<CostsTabProps> = ({ selectedYear }) => {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadCosts = async () => {
    try {
      setLoading(true);
      const data = await costService.getCostsByYear(selectedYear);
      setCosts(data);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento dei costi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCosts();
  }, [selectedYear]);

  const handleCreateCost = async (cost: Omit<Cost, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await costService.createCost(cost);
      setShowForm(false);
      loadCosts();
    } catch (err) {
      console.error('Error creating cost:', err);
    }
  };

  const handleUpdateCost = async (id: string, cost: Omit<Cost, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await costService.updateCost(id, cost);
      loadCosts();
    } catch (err) {
      console.error('Error updating cost:', err);
    }
  };

  const handleDeleteCost = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo costo?')) {
      try {
        await costService.deleteCost(id);
        loadCosts();
      } catch (err) {
        console.error('Error deleting cost:', err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Costi {selectedYear}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Nuovo Costo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <CostForm
          onSubmit={handleCreateCost}
          onCancel={() => setShowForm(false)}
        />
      )}

      <CostList
        costs={costs}
        onUpdate={handleUpdateCost}
        onDelete={handleDeleteCost}
      />

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-lg font-medium text-gray-900">
          Totale costi: €{' '}
          {costs.reduce((sum, cost) => sum + cost.amount, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
};
