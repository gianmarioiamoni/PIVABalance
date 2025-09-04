"use client";

import { useCallback } from "react";
import { useNotifications } from "@/providers/NotificationProvider";

// Error types for better error handling
export interface AppError {
  message: string;
  code?: string;
  details?: string;
  retry?: () => void;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Type for API error response
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Custom hook for centralized error handling
 *
 * Provides consistent error handling across the application
 * Integrates with the notification system for user feedback
 *
 * Features:
 * - Centralized error logging and reporting
 * - User-friendly error messages
 * - Integration with notification system
 * - Error categorization and appropriate handling
 * - Retry functionality for recoverable errors
 */
export function useErrorHandler() {
  const { showError, showWarning } = useNotifications();

  // Handle general application errors
  const handleError = useCallback(
    (error: Error | AppError | string, context?: string) => {
      console.error("Application Error:", { error, context });

      let title = "Si è verificato un errore";
      let message =
        "Riprova più tardi o contatta il supporto se il problema persiste.";

      // Handle different error types
      if (typeof error === "string") {
        message = error;
      } else if ("message" in error) {
        message = error.message;

        // Check if it's an AppError with additional info
        if ("code" in error && error.code) {
          title = `Errore ${error.code}`;
        }

        if ("details" in error && error.details) {
          message = `${message}\n\nDettagli: ${error.details}`;
        }
      }

      // Add context to title if provided
      if (context) {
        title = `${title} - ${context}`;
      }

      // Show notification
      return showError(title, message, 0); // Don't auto-dismiss errors
    },
    [showError]
  );

  // Handle API errors with specific error code handling
  const handleApiError = useCallback(
    (error: ApiErrorResponse, defaultMessage: string = "Errore del server") => {
      console.error("API Error:", error);

      let title = "Errore del server";
      let message = defaultMessage;

      // Handle different API error formats
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.response?.status) {
        const status = error.response.status;

        switch (status) {
          case 400:
            title = "Richiesta non valida";
            message = "I dati inviati non sono corretti. Verifica e riprova.";
            break;
          case 401:
            title = "Accesso negato";
            message = "Devi effettuare il login per continuare.";
            break;
          case 403:
            title = "Accesso vietato";
            message = "Non hai i permessi necessari per questa operazione.";
            break;
          case 404:
            title = "Risorsa non trovata";
            message = "La risorsa richiesta non è stata trovata.";
            break;
          case 409:
            title = "Conflitto";
            message = "Esiste già una risorsa con questi dati.";
            break;
          case 422:
            title = "Dati non validi";
            message =
              "I dati forniti non sono validi. Controlla i campi e riprova.";
            break;
          case 429:
            title = "Troppe richieste";
            message =
              "Hai effettuato troppe richieste. Attendi un momento e riprova.";
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            title = "Errore del server";
            message =
              "Problema temporaneo del server. Riprova tra qualche minuto.";
            break;
          default:
            message = error.message || defaultMessage;
        }
      } else if (error?.message) {
        message = error.message;
      }

      return showError(title, message, 0);
    },
    [showError]
  );

  // Handle validation errors
  const handleValidationErrors = useCallback(
    (errors: ValidationError[] | Record<string, string>) => {
      console.warn("Validation Errors:", errors);

      let message: string;

      if (Array.isArray(errors)) {
        message = errors
          .map((err) => `• ${err.field}: ${err.message}`)
          .join("\n");
      } else {
        message = Object.entries(errors)
          .map(([field, msg]) => `• ${field}: ${msg}`)
          .join("\n");
      }

      return showWarning(
        "Errori di validazione",
        `Correggi i seguenti errori:\n\n${message}`,
        8000 // Show longer for validation errors
      );
    },
    [showWarning]
  );

  // Handle network errors
  const handleNetworkError = useCallback(
    (error?: Error) => {
      console.error("Network Error:", error);

      return showError(
        "Errore di connessione",
        "Verifica la tua connessione internet e riprova.",
        0
      );
    },
    [showError]
  );

  // Wrapper for async operations with error handling
  const withErrorHandling = useCallback(
    <T extends unknown[], R>(
      fn: (...args: T) => Promise<R>,
      context?: string,
      customErrorHandler?: (error: Error) => void
    ) => {
      return async (...args: T): Promise<R | undefined> => {
        try {
          return await fn(...args);
        } catch (error) {
          if (customErrorHandler) {
            customErrorHandler(error as Error);
          } else {
            handleError(error as Error, context);
          }
          return undefined;
        }
      };
    },
    [handleError]
  );

  return {
    handleError,
    handleApiError,
    handleValidationErrors,
    handleNetworkError,
    withErrorHandling,
  };
}
