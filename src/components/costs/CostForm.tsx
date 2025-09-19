'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FormErrorMessage } from './FormErrorMessage';
import { ICost } from '@/types';

// Extend ICost to include deductible property for the form
type CostFormData = ICost & {
  deductible?: boolean;
};

interface CostFormProps {
  isOpen: boolean;
  onClose: () => void;
  cost: Partial<CostFormData>;
  onChange: (cost: Partial<CostFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

/**
 * CostForm Component (Updated with Design System)
 * 
 * Form component for creating/editing costs
 * Now uses centralized design system classes for consistency
 */
export const CostForm: React.FC<CostFormProps> = ({
  isOpen,
  onClose,
  cost,
  onChange,
  onSubmit,
  errors,
  touched,
  isSubmitting
}) => {

  if (!isOpen) return null;

  const fieldErrors = errors || {};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="card-header flex items-center justify-between">
          <h3 className="heading-md">
            {cost._id ? 'Modifica Costo' : 'Nuovo Costo'}
          </h3>
          <button
            onClick={onClose}
            className="text-quaternary hover:text-secondary transition-colors"
            aria-label="Chiudi"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="card-body space-y-4">
          {/* Error Summary */}
          {Object.keys(fieldErrors).length > 0 && (
            <div className="status-error p-3 rounded-md flex items-center">
              <FormErrorMessage message="Correggi gli errori evidenziati" />
            </div>
          )}

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Descrizione *
            </label>
            <input
              type="text"
              value={cost.description || ''}
              onChange={(e) => onChange({ ...cost, description: e.target.value })}
              className={`input-base px-3 py-2 ${touched.description && fieldErrors.description
                ? 'border-error focus:border-error focus:ring-error'
                : ''
                }`}
              placeholder="Inserisci la descrizione del costo"
              required
            />
            {touched.description && fieldErrors.description && (
              <FormErrorMessage message={fieldErrors.description} />
            )}
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Data *
            </label>
            <input
              type="date"
              value={cost.date ? new Date(cost.date).toISOString().split('T')[0] : ''}
              onChange={(e) => onChange({ ...cost, date: new Date(e.target.value) })}
              className={`input-base px-3 py-2 ${touched.date && fieldErrors.date
                ? 'border-error focus:border-error focus:ring-error'
                : ''
                }`}
              required
            />
            {touched.date && fieldErrors.date && (
              <FormErrorMessage message={fieldErrors.date} />
            )}
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Importo (€) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={cost.amount || ''}
              onChange={(e) => onChange({ ...cost, amount: Number(e.target.value) })}
              className={`input-base px-3 py-2 ${touched.amount && fieldErrors.amount
                ? 'border-error focus:border-error focus:ring-error'
                : ''
                }`}
              placeholder="0.00"
              required
            />
            {touched.amount && fieldErrors.amount && (
              <FormErrorMessage message={fieldErrors.amount} />
            )}
          </div>

          {/* Deductible Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="deductible"
              checked={cost.deductible ?? true}
              onChange={(e) => onChange({ ...cost, deductible: e.target.checked })}
              className="h-4 w-4 text-brand-primary border-surface-border rounded focus:ring-brand-primary focus:ring-2"
            />
            <label htmlFor="deductible" className="ml-2 text-sm text-secondary">
              Detraibile
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2"
              disabled={isSubmitting}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvataggio...' : cost._id ? 'Aggiorna' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
