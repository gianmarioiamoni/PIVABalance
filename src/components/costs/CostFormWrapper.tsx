import React, { useState } from 'react';
import { CostForm } from './CostForm';
import { CreateCostData } from '@/services/costService';
import { ICost } from '@/types';

// Extend ICost to include deductible property for the form
type CostFormData = ICost & {
    deductible?: boolean;
};

interface CostFormWrapperProps {
    onSubmit: (costData: CreateCostData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    error?: string | null;
    cost?: CreateCostData;
}

/**
 * Wrapper component to adapt old CostForm interface to new one
 * Maintains backward compatibility while using the new design system
 */
export const CostFormWrapper: React.FC<CostFormWrapperProps> = ({
    onSubmit,
    onCancel,
    loading = false,
    error = null,
    cost
}) => {
    const [formData, setFormData] = useState<Partial<CostFormData>>({
        description: cost?.description || '',
        date: cost?.date ? new Date(cost.date) : new Date(),
        amount: cost?.amount || 0,
        deductible: cost?.deductible ?? true
    });

    const [touched, setTouched] = useState({
        description: false,
        date: false,
        amount: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.description?.trim()) {
            newErrors.description = 'La descrizione è obbligatoria';
        }

        if (!formData.date) {
            newErrors.date = 'La data è obbligatoria';
        }

        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'L\'importo deve essere maggiore di 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            description: true,
            date: true,
            amount: true
        });

        if (!validateForm()) {
            return;
        }

        // Safe access with fallbacks instead of non-null assertions
        const costData: CreateCostData = {
            description: formData.description || '',
            date: formData.date ? (formData.date instanceof Date ? formData.date.toISOString() : formData.date) : new Date().toISOString(),
            amount: formData.amount || 0,
            deductible: formData.deductible ?? true
        };

        try {
            await onSubmit(costData);
        } catch (err) {
            console.error('Error submitting cost:', err);
        }
    };

    console.log('🔍 DEBUG: CostFormWrapper rendering with isOpen=true');

    return (
        <CostForm
            isOpen={true}
            onClose={onCancel}
            cost={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            errors={error ? { submit: error } : errors}
            touched={touched}
            isSubmitting={loading}
        />
    );
}; 