'use client';

import React, { useState } from 'react';
import { Cost } from '@/services/costService';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CostFormWrapper } from './CostFormWrapper';

interface CostListProps {
  costs: Cost[];
  onUpdate: (_id: string, cost: Omit<Cost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  error?: string | null;
}

export const CostList: React.FC<CostListProps> = ({
  costs,
  onUpdate,
  onDelete,
  loading = false,
  error
}) => {
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [costToDelete, setCostToDelete] = useState<Cost | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleEdit = (cost: Cost) => {
    setEditingCost(cost);
  };

  const handleUpdate = (updatedCost: Omit<Cost, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCost) {
      onUpdate(editingCost.id, updatedCost);
      setEditingCost(null);
    }
  };

  const handleDeleteClick = (cost: Cost) => {
    setCostToDelete(cost);
  };

  const handleDeleteConfirm = () => {
    if (costToDelete) {
      onDelete(costToDelete.id);
      setCostToDelete(null);
    }
  };

  const toggleRowExpansion = (costId: string) => {
    setExpandedRow(expandedRow === costId ? null : costId);
  };

  if (costs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">Nessun costo registrato</p>
        <p className="text-gray-400 text-sm mt-1">I costi che aggiungerai appariranno qui</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {editingCost && (
        <div className="border-l-4 border-blue-500 bg-blue-50 p-1 rounded-r-lg">
          <CostFormWrapper
            cost={{
              description: editingCost.description,
              date: editingCost.date,
              amount: editingCost.amount,
              deductible: true // Default value for existing costs
            }}
            onSubmit={async (costData) => {
              // Convert to the expected format for handleUpdate
              const updateData = {
                description: costData.description,
                date: costData.date,
                amount: costData.amount,
                deductible: costData.deductible
              };
              await handleUpdate(updateData);
            }}
            onCancel={() => setEditingCost(null)}
            loading={loading}
            error={error}
          />
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrizione
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importo
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deducibile
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costs.map((cost) => (
                <tr
                  key={cost.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(cost.date), 'dd MMM yyyy', { locale: it })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={cost.description}>
                      {cost.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                    {formatCurrency(cost.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cost.deductible
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {cost.deductible ? 'Sì' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(cost)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50 transition-colors"
                        title="Modifica costo"
                      >
                        <PencilIcon className="h-5 w-5" />
                        <span className="sr-only">Modifica</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cost)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
                        title="Elimina costo"
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
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {costs.map((cost) => (
          <div
            key={cost.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {cost.description}
                    </p>
                    <button
                      onClick={() => toggleRowExpansion(cost.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title={expandedRow === cost.id ? 'Comprimi' : 'Espandi'}
                    >
                      {expandedRow === cost.id ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(cost.amount)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cost.deductible
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {cost.deductible ? 'Deducibile' : 'Non deducibile'}
                    </span>
                  </div>

                  {expandedRow === cost.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Data:</span> {format(new Date(cost.date), 'dd MMM yyyy', { locale: it })}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Descrizione completa:</span> {cost.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(cost)}
                  disabled={loading}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Modifica
                </button>
                <button
                  onClick={() => handleDeleteClick(cost)}
                  disabled={loading}
                  className="flex items-center px-3 py-1 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Elimina
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!costToDelete}
        onCancel={() => setCostToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Conferma eliminazione costo"
        message={`Sei sicuro di voler eliminare il costo "${costToDelete?.description}" di ${costToDelete ? formatCurrency(costToDelete.amount) : ""} del ${costToDelete ? format(new Date(costToDelete.date), "dd MMM yyyy", { locale: it }) : ""}? Questa azione non può essere annullata.`} loading={loading}
      />
    </div>
  );
};
