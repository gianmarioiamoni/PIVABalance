/**
 * Report Generator Hook
 *
 * SRP: Handles ONLY report generation logic and state management
 * Advanced report generation with progress tracking
 */

"use client";

import { useState, useCallback } from "react";
import { ReportConfig } from "@/components/reports/ReportGenerator";

/**
 * Generated Report Interface
 * SRP: Defines only generated report structure
 */
export interface GeneratedReport {
  id: string;
  name: string;
  format: string;
  url: string;
  createdAt: Date;
  config: ReportConfig;
}

/**
 * Report Generation Steps
 * SRP: Defines only generation process steps
 */
const GENERATION_STEPS = [
  { step: "data-collection", label: "Raccolta dati...", progress: 10 },
  { step: "data-processing", label: "Elaborazione dati...", progress: 30 },
  { step: "chart-generation", label: "Generazione grafici...", progress: 50 },
  {
    step: "analytics-calculation",
    label: "Calcolo analytics...",
    progress: 70,
  },
  { step: "report-compilation", label: "Compilazione report...", progress: 90 },
  { step: "finalization", label: "Finalizzazione...", progress: 100 },
];

/**
 * Mock Report Generator Service
 * SRP: Handles only report generation simulation
 * TODO: Replace with actual report generation service
 */
const mockReportGeneration = async (
  config: ReportConfig,
  onProgress: (progress: number, step: string) => void
): Promise<string> => {
  for (const { step, label, progress } of GENERATION_STEPS) {
    onProgress(progress, label);

    // Simulate processing time based on complexity
    let delay = 500;
    if (step === "chart-generation" && config.includeCharts) delay = 1500;
    if (step === "analytics-calculation" && config.includeAnalytics)
      delay = 1000;
    if (step === "report-compilation") delay = 2000;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Generate mock download URL
  const timestamp = Date.now();
  return `/api/reports/download/${timestamp}-${config.type}-report.${config.format}`;
};

/**
 * Report Generator Hook
 * SRP: Handles only report generation state and orchestration
 */
export const useReportGenerator = (_userId: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(
    []
  );

  // Progress handler
  const handleProgress = useCallback((newProgress: number, step: string) => {
    setProgress(newProgress);
    setCurrentStep(step);
  }, []);

  // Generate report function
  const generateReport = useCallback(
    async (config: ReportConfig): Promise<string> => {
      try {
        setIsGenerating(true);
        setProgress(0);
        setError(null);

        // Generate report
        const reportUrl = await mockReportGeneration(config, handleProgress);

        // Create report record
        const newReport: GeneratedReport = {
          id: `report-${Date.now()}`,
          name: `${config.type}-report-${new Date().toLocaleDateString(
            "it-IT"
          )}`,
          format: config.format,
          url: reportUrl,
          createdAt: new Date(),
          config,
        };

        // Add to generated reports
        setGeneratedReports((prev) => [newReport, ...prev]);

        return reportUrl;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Errore sconosciuto durante la generazione";
        setError(errorMessage);
        throw err;
      } finally {
        setIsGenerating(false);
        setProgress(0);
        setCurrentStep("");
      }
    },
    [handleProgress]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Remove report
  const removeReport = useCallback((reportId: string) => {
    setGeneratedReports((prev) =>
      prev.filter((report) => report.id !== reportId)
    );
  }, []);

  return {
    generateReport,
    isGenerating,
    progress,
    currentStep,
    error,
    generatedReports,
    clearError,
    removeReport,
  };
};
