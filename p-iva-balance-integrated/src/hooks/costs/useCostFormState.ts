import { useState, useEffect } from 'react';
import { CreateCostData } from '@/services/costService';
import { useFormValidation } from '@/hooks/useFormValidation';
import { costFormValidationRules } from '@/utils/costFormValidation';

interface UseCostFormStateProps {
    initialCost?: CreateCostData;
    onSubmit: (cost: CreateCostData) => void;
    onCancel: () => void;
}

interface UseCostFormStateReturn {
    formData: CreateCostData;
    fieldErrors: Partial<Record<keyof CreateCostData, string>>;
    touched: Partial<Record<keyof CreateCostData, boolean>>;
    isValid: boolean;
    updateField: (field: keyof CreateCostData, value: CreateCostData[keyof CreateCostData]) => void;
    handleFieldBlur: (field: keyof CreateCostData) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleCancel: () => void;
}

/**
 * Custom hook for managing cost form state and validation
 * Follows SRP by handling only form state management
 * Separates form logic from UI components
 */
export const useCostFormState = ({
    initialCost,
    onSubmit,
    onCancel
}: UseCostFormStateProps): UseCostFormStateReturn => {
    // Initialize form data with defaults or provided initial cost
    const getInitialFormData = (): CreateCostData => ({
        description: initialCost?.description || '',
        date: initialCost?.date ? initialCost.date.split('T')[0] : new Date().toISOString().split('T')[0],
        amount: initialCost?.amount || 0,
        deductible: initialCost?.deductible ?? true
    });

    const [formData, setFormData] = useState<CreateCostData>(getInitialFormData);

    const {
        fieldErrors,
        touched,
        isValid,
        validateField,
        markFieldTouched,
        validateAllFields,
        clearErrors
    } = useFormValidation<CreateCostData>(costFormValidationRules);

    // Update form data when initialCost changes
    useEffect(() => {
        if (initialCost) {
            const newFormData: CreateCostData = {
                description: initialCost.description,
                date: initialCost.date.split('T')[0],
                amount: initialCost.amount,
                deductible: initialCost.deductible
            };
            setFormData(newFormData);
            clearErrors();
        }
    }, [initialCost, clearErrors]);

    const updateField = (field: keyof CreateCostData, value: CreateCostData[keyof CreateCostData]): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            validateField(field, value);
        }
    };

    const handleFieldBlur = (field: keyof CreateCostData): void => {
        markFieldTouched(field);
        validateField(field, formData[field]);
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        
        if (validateAllFields(formData)) {
            onSubmit(formData);
        }
    };

    const handleCancel = (): void => {
        clearErrors();
        onCancel();
    };

    return {
        formData,
        fieldErrors,
        touched,
        isValid,
        updateField,
        handleFieldBlur,
        handleSubmit,
        handleCancel
    };
}; 