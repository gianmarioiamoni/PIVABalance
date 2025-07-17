"use client";

import { useCallback } from "react";
import { useNotifications } from "@/providers/NotificationProvider";

/**
 * Custom hook for centralized success and info message handling
 *
 * Provides consistent messaging across the application
 * Integrates with the notification system for user feedback
 *
 * Features:
 * - Success messages for completed actions
 * - Info messages for general information
 * - Consistent timing and styling
 * - Action callbacks for interactive messages
 */
export function useMessages() {
  const { showSuccess, showInfo, showWarning } = useNotifications();

  // Success messages for completed operations
  const showSuccessMessage = useCallback(
    (title: string, message: string) => {
      return showSuccess(title, message, 5000);
    },
    [showSuccess]
  );

  // Info messages for general information
  const showInfoMessage = useCallback(
    (title: string, message: string, duration?: number) => {
      return showInfo(title, message, duration ?? 6000);
    },
    [showInfo]
  );

  // Warning messages for non-critical issues
  const showWarningMessage = useCallback(
    (title: string, message: string, duration?: number) => {
      return showWarning(title, message, duration ?? 7000);
    },
    [showWarning]
  );

  // Common success messages
  const showOperationSuccess = useCallback(
    (operation: string, entityName?: string) => {
      const entity = entityName ? ` ${entityName}` : "";
      return showSuccessMessage(
        "Operazione completata",
        `${operation}${entity} completata con successo.`
      );
    },
    [showSuccessMessage]
  );

  // CRUD operation success messages
  const showCreateSuccess = useCallback(
    (entityName: string) => {
      return showSuccessMessage(
        "Elemento creato",
        `${entityName} creato con successo.`
      );
    },
    [showSuccessMessage]
  );

  const showUpdateSuccess = useCallback(
    (entityName: string) => {
      return showSuccessMessage(
        "Elemento aggiornato",
        `${entityName} aggiornato con successo.`
      );
    },
    [showSuccessMessage]
  );

  const showDeleteSuccess = useCallback(
    (entityName: string) => {
      return showSuccessMessage(
        "Elemento eliminato",
        `${entityName} eliminato con successo.`
      );
    },
    [showSuccessMessage]
  );

  // Settings and configuration messages
  const showSettingsSaved = useCallback(() => {
    return showSuccessMessage(
      "Impostazioni salvate",
      "Le tue impostazioni sono state salvate correttamente."
    );
  }, [showSuccessMessage]);

  const showDataSynced = useCallback(() => {
    return showInfoMessage(
      "Dati sincronizzati",
      "I tuoi dati sono stati sincronizzati con il server."
    );
  }, [showInfoMessage]);

  // Authentication messages
  const showLoginSuccess = useCallback(
    (userName?: string) => {
      const name = userName ? `, ${userName}` : "";
      return showSuccessMessage(
        "Accesso effettuato",
        `Benvenuto${name}! Accesso completato con successo.`
      );
    },
    [showSuccessMessage]
  );

  const showLogoutSuccess = useCallback(() => {
    return showInfoMessage(
      "Disconnesso",
      "Sei stato disconnesso con successo. A presto!"
    );
  }, [showInfoMessage]);

  // Form and validation messages
  const showFormSubmitted = useCallback(
    (formName?: string) => {
      const form = formName ? ` ${formName}` : "";
      return showSuccessMessage(
        "Form inviato",
        `Il${form} è stato inviato correttamente.`
      );
    },
    [showSuccessMessage]
  );

  const showDataLoaded = useCallback(
    (dataType?: string) => {
      const type = dataType ? ` ${dataType}` : "";
      return showInfoMessage(
        "Dati caricati",
        `I${type} sono stati caricati correttamente.`,
        3000 // Shorter duration for data loading messages
      );
    },
    [showInfoMessage]
  );

  // Process and workflow messages
  const showProcessStarted = useCallback(
    (processName: string) => {
      return showInfoMessage(
        "Processo avviato",
        `${processName} avviato. Ti informeremo quando sarà completato.`
      );
    },
    [showInfoMessage]
  );

  const showProcessCompleted = useCallback(
    (processName: string) => {
      return showSuccessMessage(
        "Processo completato",
        `${processName} completato con successo.`
      );
    },
    [showSuccessMessage]
  );

  // Backup and maintenance messages
  const showBackupCreated = useCallback(() => {
    return showSuccessMessage(
      "Backup creato",
      "Il backup dei tuoi dati è stato creato con successo."
    );
  }, [showSuccessMessage]);

  const showMaintenanceNotice = useCallback(
    (message: string) => {
      return showWarningMessage(
        "Manutenzione programmata",
        message,
        0 // Don't auto-dismiss maintenance notices
      );
    },
    [showWarningMessage]
  );

  return {
    // Base methods
    showSuccessMessage,
    showInfoMessage,
    showWarningMessage,

    // Common operations
    showOperationSuccess,

    // CRUD operations
    showCreateSuccess,
    showUpdateSuccess,
    showDeleteSuccess,

    // Settings
    showSettingsSaved,
    showDataSynced,

    // Authentication
    showLoginSuccess,
    showLogoutSuccess,

    // Forms
    showFormSubmitted,
    showDataLoaded,

    // Processes
    showProcessStarted,
    showProcessCompleted,

    // System
    showBackupCreated,
    showMaintenanceNotice,
  };
}
