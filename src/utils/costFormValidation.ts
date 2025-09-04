import { ValidationRule, ValidationRules } from "@/hooks/useFormValidation";
import { CreateCostData } from "@/services/costService";

/**
 * Pure validation functions for cost form fields
 * Following functional programming principles
 */

export const validateDescription: ValidationRule<string> = (
  value: string
): string | null => {
  if (!value?.trim()) {
    return "La descrizione è obbligatoria";
  }
  if (value.trim().length < 3) {
    return "La descrizione deve avere almeno 3 caratteri";
  }
  if (value.trim().length > 200) {
    return "La descrizione non può superare i 200 caratteri";
  }
  return null;
};

export const validateDate: ValidationRule<string> = (
  value: string
): string | null => {
  if (!value) {
    return "La data è obbligatoria";
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return "Inserire una data valida";
  }

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  if (date > today) {
    return "La data non può essere futura";
  }

  if (date < oneYearAgo) {
    return "La data non può essere più vecchia di un anno";
  }

  return null;
};

export const validateAmount: ValidationRule<number> = (
  value: number
): string | null => {
  if (value === undefined || value === null) {
    return "L'importo è obbligatorio";
  }

  if (isNaN(value) || value <= 0) {
    return "Inserire un importo valido maggiore di 0";
  }

  if (value > 999999.99) {
    return "L'importo non può superare €999.999,99";
  }

  // Check for more than 2 decimal places
  if ((value * 100) % 1 !== 0) {
    return "L'importo non può avere più di 2 decimali";
  }

  return null;
};

export const validateDeductible: ValidationRule<boolean> = ():
  | string
  | null => {
  // Boolean fields rarely need validation beyond type checking
  return null;
};

/**
 * Complete validation rules object for cost form
 * Can be used with useFormValidation hook
 */
export const costFormValidationRules: ValidationRules<CreateCostData> = {
  description: validateDescription,
  date: validateDate,
  amount: validateAmount,
  deductible: validateDeductible,
};
