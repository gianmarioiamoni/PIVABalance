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

      <ConfirmDialog
        isOpen={costToDelete !== null}
        title="Elimina costo"
        message={`Sei sicuro di voler eliminare il costo "${costToDelete?.description}" del ${costToDelete ? format(new Date(costToDelete.date), 'dd/MM/yyyy', { locale: it }) : ''}"?`}
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCostToDelete(null)}
      />

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
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleEdit(cost)}
                    className="text-blue-600 hover:text-blue-900 group relative"
                  >
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Modifica costo</span>
                    <span className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap">
                      Modifica costo
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cost)}
                    className="text-red-600 hover:text-red-900 group relative"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Elimina costo</span>
                    <span className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap">
                      Elimina costo
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CostList;
