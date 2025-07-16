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

  const validateField = (name: string, value: any): string | null => {
    switch (name) {
      case 'description':
        return !value?.trim() ? 'La descrizione è obbligatoria' : null;
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

  const handleFieldChange = (name: string, value: any) => {
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

    if (!validateForm()) {
      return;
    }

    const submitData: CreateCostData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      amount: Number(formData.amount)
    };

    onSubmit(submitData);
  };

  const getFieldError = (fieldName: string): string | null => {
    return touched[fieldName] ? fieldErrors[fieldName] || null : null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <h3 className="text-lg font-semibold text-white">
          {cost ? 'Modifica Costo' : 'Nuovo Costo'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione *
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              onBlur={() => handleFieldBlur('description')}
              className={`block w-full border-0 rounded-lg shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm transition-colors ${getFieldError('description')
                  ? 'ring-red-300 focus:ring-red-500 bg-red-50'
                  : 'ring-gray-300 focus:ring-blue-500'
                }`}
              placeholder="Inserisci la descrizione del costo"
              disabled={loading}
              aria-describedby={getFieldError('description') ? 'description-error' : undefined}
            />
            {getFieldError('description') && (
              <p id="description-error" className="mt-1 text-sm text-red-600">
                {getFieldError('description')}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Data *
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              onBlur={() => handleFieldBlur('date')}
              className={`block w-full border-0 rounded-lg shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm transition-colors ${getFieldError('date')
                  ? 'ring-red-300 focus:ring-red-500 bg-red-50'
                  : 'ring-gray-300 focus:ring-blue-500'
                }`}
              disabled={loading}
              aria-describedby={getFieldError('date') ? 'date-error' : undefined}
            />
            {getFieldError('date') && (
              <p id="date-error" className="mt-1 text-sm text-red-600">
                {getFieldError('date')}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Importo (€) *
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => handleFieldChange('amount', e.target.value)}
              onBlur={() => handleFieldBlur('amount')}
              step="0.01"
              min="0"
              className={`block w-full border-0 rounded-lg shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm transition-colors ${getFieldError('amount')
                  ? 'ring-red-300 focus:ring-red-500 bg-red-50'
                  : 'ring-gray-300 focus:ring-blue-500'
                }`}
              placeholder="0,00"
              disabled={loading}
              aria-describedby={getFieldError('amount') ? 'amount-error' : undefined}
            />
            {getFieldError('amount') && (
              <p id="amount-error" className="mt-1 text-sm text-red-600">
                {getFieldError('amount')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="deductible"
            checked={formData.deductible}
            onChange={(e) => handleFieldChange('deductible', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
            disabled={loading}
          />
          <label htmlFor="deductible" className="text-sm font-medium text-gray-700">
            Costo deducibile
          </label>
          <span className="text-xs text-gray-500">
            (I costi deducibili riducono il reddito imponibile)
          </span>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading || Object.values(fieldErrors).some(error => error)}
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {cost ? 'Aggiorna Costo' : 'Crea Costo'}
          </button>
        </div>
      </form>
    </div>
  );
};
