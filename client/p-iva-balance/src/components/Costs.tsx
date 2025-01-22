import React, { useState, useEffect } from 'react';
import { Cost, costService } from '@/services/costService';
import CostForm from './costs/CostForm';
import CostList from './costs/CostList';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useTaxSettings } from '@/hooks/useTaxSettings';

export default function Costs() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const currentYear = new Date().getFullYear();
  const { state: taxState } = useTaxSettings();
  const isForfettario = taxState.settings?.taxRegime === 'forfettario';

  useEffect(() => {
    loadCosts();
  }, []);

  const loadCosts = async () => {
    try {
      setLoading(true);
      const data = await costService.getCostsByYear(currentYear);
      setCosts(data);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento dei costi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    try {
      await costService.deleteCost(id);
      loadCosts();
    } catch (err) {
      console.error('Error deleting cost:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!isForfettario && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Costi {currentYear}</h1>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuovo Costo
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">Caricamento...</div>
          ) : (
            <CostList costs={costs} onUpdate={handleUpdateCost} onDelete={handleDeleteCost} />
          )}

          {showForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Nuovo Costo</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <CostForm
                  onSubmit={handleCreateCost}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
