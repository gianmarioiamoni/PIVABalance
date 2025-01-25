import React, { useState } from 'react';
import { Cost } from '@/services/costService';
import CostForm from './CostForm';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../ConfirmDialog';

interface CostListProps {
  costs: Cost[];
  onUpdate: (id: string, cost: Omit<Cost, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete: (id: string) => void;
}

const CostList: React.FC<CostListProps> = ({ costs, onUpdate, onDelete }) => {
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [costToDelete, setCostToDelete] = useState<Cost | null>(null);

  const handleEdit = (cost: Cost) => {
    setEditingCost(cost);
  };

  const handleUpdate = (updatedCost: Omit<Cost, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCost) {
      onUpdate(editingCost._id, updatedCost);
      setEditingCost(null);
    }
  };

  const handleDeleteClick = (cost: Cost) => {
    setCostToDelete(cost);
  };

  const handleDeleteConfirm = () => {
    if (costToDelete) {
      onDelete(costToDelete._id);
      setCostToDelete(null);
    }
  };

  if (costs.length === 0) {
    return <p className="text-gray-500 text-center py-4">Nessun costo registrato.</p>;
  }

  return (
    <div>
      {editingCost && (
        <div className="mb-4">
          <CostForm
            onSubmit={handleUpdate}
            onCancel={() => setEditingCost(null)}
            initialData={editingCost}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrizione
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Importo
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detraibile
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {costs.map((cost) => (
              <tr key={cost._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(cost.date), 'dd MMM yyyy', { locale: it })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {cost.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  €{cost.amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {cost.deductible ? 'Sì' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(cost)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span className="sr-only">Modifica</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(cost)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="sr-only">Elimina</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!costToDelete}
        onClose={() => setCostToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Conferma eliminazione"
        message={`Sei sicuro di voler eliminare il costo "${costToDelete?.description}"?`}
      />
    </div>
  );
};

export default CostList;
