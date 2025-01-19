import React, { useState } from 'react';
import { Cost } from '@/services/costService';
import CostForm from './CostForm';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface CostListProps {
  costs: Cost[];
  onUpdate: (id: string, cost: Omit<Cost, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete: (id: string) => void;
}

const CostList: React.FC<CostListProps> = ({ costs, onUpdate, onDelete }) => {
  const [editingCost, setEditingCost] = useState<Cost | null>(null);

  const handleEdit = (cost: Cost) => {
    setEditingCost(cost);
  };

  const handleUpdate = (updatedCost: Omit<Cost, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCost) {
      onUpdate(editingCost._id, updatedCost);
      setEditingCost(null);
    }
  };

  if (costs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nessun costo registrato per quest'anno.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {editingCost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <CostForm
                cost={editingCost}
                onSubmit={handleUpdate}
                onCancel={() => setEditingCost(null)}
              />
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrizione
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Importo
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Azioni</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {costs.map((cost) => (
            <tr key={cost._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(cost.date), 'dd/MM/yyyy', { locale: it })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {cost.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                € {cost.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleEdit(cost)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Modifica
                </button>
                <button
                  onClick={() => onDelete(cost._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CostList;
