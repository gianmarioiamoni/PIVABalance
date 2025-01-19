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
    <>
      {editingCost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 max-w-[90%] shadow-lg rounded-md bg-white">
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

      <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        {/* Desktop version */}
        <table className="hidden sm:table min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Data
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Descrizione
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Importo
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Azioni</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {costs.map((cost) => (
              <tr key={cost._id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                  {format(new Date(cost.date), 'dd/MM/yyyy', { locale: it })}
                </td>
                <td className="px-3 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate sm:max-w-none">
                    {cost.description}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  € {cost.amount.toFixed(2)}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
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

        {/* Mobile version */}
        <div className="sm:hidden divide-y divide-gray-200">
          {costs.map((cost) => (
            <div key={cost._id} className="bg-white p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {cost.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(cost.date), 'dd/MM/yyyy', { locale: it })}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(cost)}
                    className="p-2 text-blue-600 hover:text-blue-900 group relative"
                  >
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Modifica costo</span>
                    <span className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap">
                      Modifica costo
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cost)}
                    className="p-2 text-red-600 hover:text-red-900 group relative"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Elimina costo</span>
                    <span className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap">
                      Elimina costo
                    </span>
                  </button>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                € {cost.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CostList;
