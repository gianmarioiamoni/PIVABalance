'use client';

import React, { useState, useEffect } from 'react';
import { CreateCostData } from '@/services/costService';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface CostFormProps {
  cost?: CreateCostData;
  onSubmit: (cost: CreateCostData) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export const CostForm: React.FC<CostFormProps> = ({
  cost,
  onSubmit,
  onCancel,
  loading = false,
  error
}) => {
  const [formData, setFormData] = useState<CreateCostData>({
    description: cost?.description || '',
    date: cost?.date ? cost.date.split('T')[0] : new Date().toISOString().split('T')[0],
    amount: cost?.amount || 0,
    deductible: cost?.deductible ?? true
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (cost) {
      setFormData({
        description: cost.description,
        date: cost.date.split('T')[0],
        amount: cost.amount,
        deductible: cost.deductible
      });
    }
  }, [cost]);

  const validateField = (name: string, value: string | number | boolean): string | null => {
    switch (name) {
      case 'description':
        return !value?.toString().trim() ? 'La descrizione è obbligatoria' : null;
      case 'date':
        return !value ? 'La data è obbligatoria' : null;
      case 'amount':
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          return 'Inserire un importo valido maggiore di 0';
        }
        return null;
      default:
        return null;
    }
  };

  const handleFieldChange = (name: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFieldBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldValue = formData[name as keyof CreateCostData];
    const error = validateField(name, fieldValue);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof CreateCostData]);
      if (error) {
        errors[key] = error;
      }
    });

    setFieldErrors(errors);
    setTouched({
      description: true,
      date: true,
      amount: true,
      deductible: true
    });

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderFieldError = (fieldName: string) => {
    return touched[fieldName] && fieldErrors[fieldName] ? (
      <div className="mt-1 flex items-center text-sm text-red-600">
        <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
        <span>{fieldErrors[fieldName]}</span>
      </div>
    ) : null;
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {cost ? 'Modifica Costo' : 'Nuovo Costo'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Chiudi</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrizione *
          </label>
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            onBlur={() => handleFieldBlur('description')}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${touched.description && fieldErrors.description
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            placeholder="Inserisci la descrizione del costo"
          />
          {renderFieldError('description')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              onBlur={() => handleFieldBlur('date')}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${touched.date && fieldErrors.date
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
            />
            {renderFieldError('date')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Importo (€) *
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleFieldChange('amount', Number(e.target.value))}
              onBlur={() => handleFieldBlur('amount')}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${touched.amount && fieldErrors.amount
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              placeholder="0.00"
            />
            {renderFieldError('amount')}
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.deductible}
              onChange={(e) => handleFieldChange('deductible', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">
              Costo deducibile
            </span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvataggio...' : (cost ? 'Aggiorna' : 'Crea')}
          </button>
        </div>
      </form>
    </div>
  );
};
