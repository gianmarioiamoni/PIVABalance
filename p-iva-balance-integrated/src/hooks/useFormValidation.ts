import { useState, useCallback } from "react";

export type ValidationRule<T> = (value: T, fieldName: string) => string | null;

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

export interface UseFormValidationReturn<T> {
  fieldErrors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  validateField: (fieldName: keyof T, value: T[keyof T]) => void;
  markFieldTouched: (fieldName: keyof T) => void;
  validateAllFields: (formData: T) => boolean;
  clearErrors: () => void;
  clearFieldError: (fieldName: keyof T) => void;
}

/**
 * Generic form validation hook
 */
export function useFormValidation<T extends object>(
    validationRules: ValidationRules<T>
): UseFormValidationReturn<T> {
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof T, string>>
  >({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (fieldName: keyof T, value: T[keyof T]): void => {
      const rule = validationRules[fieldName];
      if (!rule) return;

      const error = rule(value, fieldName as string);
      setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
    },
    [validationRules]
  );

  const markFieldTouched = useCallback((fieldName: keyof T): void => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  const validateAllFields = useCallback(
    (formData: T): boolean => {
      const errors: Partial<Record<keyof T, string>> = {};
      const touchedFields: Partial<Record<keyof T, boolean>> = {};

      Object.keys(validationRules).forEach((key) => {
        const fieldName = key as keyof T;
        const rule = validationRules[fieldName];

        if (rule) {
          const error = rule(formData[fieldName], fieldName as string);
          if (error) {
            errors[fieldName] = error;
          }
        }
        touchedFields[fieldName] = true;
      });

      setFieldErrors(errors);
      setTouched(touchedFields);

      return Object.keys(errors).length === 0;
    },
    [validationRules]
  );

  const clearErrors = useCallback((): void => {
    setFieldErrors({});
    setTouched({});
  }, []);

  const clearFieldError = useCallback((fieldName: keyof T): void => {
    setFieldErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  }, []);

  const isValid = Object.values(fieldErrors).every((error) => !error);

  return {
    fieldErrors,
    touched,
    isValid,
    validateField,
    markFieldTouched,
    validateAllFields,
    clearErrors,
    clearFieldError,
  };
}
