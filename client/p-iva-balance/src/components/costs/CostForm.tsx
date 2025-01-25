import React, { useState } from 'react';
import { CreateCostData } from '@/services/costService';
import { format } from 'date-fns';

interface CostFormProps {
  cost?: CreateCostData;
  onSubmit: (cost: CreateCostData) => void;
  onCancel: () => void;
}

const CostForm: React.FC<CostFormProps> = ({ cost, onSubmit, onCancel }) => {
  const [description, setDescription] = useState(cost?.description || '');
  const [date, setDate] = useState(cost?.date ? cost.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState(cost?.amount ? cost.amount.toString() : '');
  const [deductible, setDeductible] = useState(cost?.deductible ?? true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!description.trim()) {
      newErrors.description = 'La descrizione è obbligatoria';
    }
    if (!date) {
      newErrors.date = 'La data è obbligatoria';
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Inserire un importo valido maggiore di 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      description,
      date: new Date(date).toISOString(),
      amount: parseFloat(amount),
      deductible
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrizione
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Data
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Importo (€)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="deductible"
          checked={deductible}
          onChange={(e) => setDeductible(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="deductible" className="ml-2 block text-sm text-gray-900">
          Costo deducibile
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annulla
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {cost ? 'Aggiorna' : 'Crea'}
        </button>
      </div>
    </form>
  );
};

export default CostForm;
