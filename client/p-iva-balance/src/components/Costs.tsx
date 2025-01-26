import React, { useState, useEffect } from 'react';
import { Cost, costService } from '@/services/costService';
import CostForm from './costs/CostForm';
import CostList from './costs/CostList';
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

  const deductibleCosts = costs.filter(cost => cost.deductible);
  const nonDeductibleCosts = costs.filter(cost => !cost.deductible);
  const totalDeductibleCosts = deductibleCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const totalNonDeductibleCosts = nonDeductibleCosts.reduce((sum, cost) => sum + cost.amount, 0);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );

  if (loading) {
    return <div className="p-4">Caricamento...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestione Costi {currentYear}</h1>

      <Section title="1. Costi Deducibili">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Costi deducibili</h3>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Aggiungi Costo
          </button>
        </div>

        {showForm && (
          <div className="mb-4">
            <CostForm
              onSubmit={handleCreateCost}
              onCancel={() => setShowForm(false)}
              cost={{
                description: '',
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                deductible: true
              }}
            />
          </div>
        )}

        <CostList
          costs={deductibleCosts}
          onUpdate={handleUpdateCost}
          onDelete={handleDeleteCost}
        />

        <div className="mt-4 text-right">
          <p className="text-lg font-semibold">
            Totale costi deducibili: €{totalDeductibleCosts.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </Section>

      <Section title="2. Costi Non Deducibili">
        <CostList
          costs={nonDeductibleCosts}
          onUpdate={handleUpdateCost}
          onDelete={handleDeleteCost}
        />

        <div className="mt-4 text-right">
          <p className="text-lg font-semibold">
            Totale costi non deducibili: €{totalNonDeductibleCosts.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </Section>

      <div className="mt-6 bg-blue-500 text-white p-4 rounded">
        <h2 className="text-lg font-bold mb-4">Riepilogo Costi {currentYear}</h2>
        <div className="flex justify-between items-center">
          <span>Totale Costi:</span>
          <span className="font-bold">
            €{(totalDeductibleCosts + totalNonDeductibleCosts).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
