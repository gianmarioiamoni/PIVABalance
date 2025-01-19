import React, { useState, useEffect } from 'react';
import { Cost, costService } from '@/services/costService';
import CostForm from './costs/CostForm';
import CostList from './costs/CostList';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Costs() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const currentYear = new Date().getFullYear();

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

  useEffect(() => {
    loadCosts();
  }, []);

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
    <div className="space-y-6">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gestione Costi</h2>
              <p className="mt-1 text-sm text-gray-500">
                Gestisci i costi della tua attività per l'anno {currentYear}
              </p>
            </div>
            <div className="relative group">
              <button
                onClick={() => setShowForm(true)}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span className="hidden sm:inline">Nuovo Costo</span>
                <PlusIcon className="h-5 w-5 sm:hidden" aria-hidden="true" />
                <span className="sr-only">Crea nuovo costo</span>
              </button>
              <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 top-full mt-1 whitespace-nowrap sm:hidden">
                Nuovo Costo
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {showForm && (
                <div className="mb-6">
                  <CostForm
                    onSubmit={handleCreateCost}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              )}

              <div className="overflow-hidden">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <CostList
                      costs={costs}
                      onUpdate={handleUpdateCost}
                      onDelete={handleDeleteCost}
                    />
                  </div>
                </div>
              </div>

              {costs.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-medium text-gray-900">
                    Totale costi {currentYear}: €{' '}
                    {costs.reduce((sum, cost) => sum + cost.amount, 0).toFixed(2)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
