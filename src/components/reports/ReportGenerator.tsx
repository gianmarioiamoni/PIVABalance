/**
 * Report Generator Component
 * 
 * SRP: Handles ONLY report generation orchestration
 * Advanced reporting system with PDF/Excel export capabilities
 */

'use client';

import React, { useState } from 'react';
import {
    FileText,
    Download,
    AlertCircle
} from 'lucide-react';
import { useReportGenerator } from '@/hooks/reports/useReportGenerator';

/**
 * Report Type Definition
 * SRP: Defines only report types and configurations
 */
export type ReportType = 'financial' | 'tax' | 'cashflow' | 'kpi' | 'custom';
export type ReportFormat = 'pdf' | 'excel' | 'csv';
export type ReportPeriod = 'month' | 'quarter' | 'year' | 'custom';

/**
 * Report Configuration Interface
 * SRP: Interface for report configuration
 */
export interface ReportConfig {
    type: ReportType;
    format: ReportFormat;
    period: ReportPeriod;
    startDate?: Date;
    endDate?: Date;
    includeCharts: boolean;
    includeRawData: boolean;
    includeAnalytics: boolean;
    includeInsights: boolean;
    customSections?: string[];
}

/**
 * Report Generator Props
 * SRP: Interface for report generator properties
 */
export interface ReportGeneratorProps {
    userId: string;
    onReportGenerated?: (reportUrl: string, config: ReportConfig) => void;
    className?: string;
}

/**
 * Report Type Selector
 * SRP: Handles only report type selection UI
 */
const ReportTypeSelector: React.FC<{
    selectedType: ReportType;
    onTypeChange: (type: ReportType) => void;
}> = ({ selectedType, onTypeChange }) => {
    const reportTypes: { value: ReportType; label: string; description: string }[] = [
        { value: 'financial', label: '📊 Report Finanziario', description: 'Ricavi, costi, profitti' },
        { value: 'tax', label: '🧾 Report Fiscale', description: 'IVA, ritenute, tasse' },
        { value: 'cashflow', label: '💰 Cash Flow', description: 'Flussi di cassa mensili' },
        { value: 'kpi', label: '🎯 KPI Analytics', description: 'Metriche chiave performance' },
        { value: 'custom', label: '⚙️ Report Personalizzato', description: 'Configurazione avanzata' }
    ];

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Tipo di Report</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {reportTypes.map(type => (
                    <button
                        key={type.value}
                        onClick={() => onTypeChange(type.value)}
                        className={`p-3 text-left rounded-lg border-2 transition-all ${selectedType === type.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{type.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

/**
 * Report Format Selector
 * SRP: Handles only format selection UI
 */
const ReportFormatSelector: React.FC<{
    selectedFormat: ReportFormat;
    onFormatChange: (format: ReportFormat) => void;
}> = ({ selectedFormat, onFormatChange }) => {
    const formats: { value: ReportFormat; label: string; description: string }[] = [
        { value: 'pdf', label: '📄 PDF', description: 'Formato stampa professionale' },
        { value: 'excel', label: '📊 Excel', description: 'Dati modificabili e analizzabili' },
        { value: 'csv', label: '📋 CSV', description: 'Dati grezzi per elaborazione' }
    ];

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Formato Output</label>
            <div className="flex items-center space-x-3">
                {formats.map(format => (
                    <button
                        key={format.value}
                        onClick={() => onFormatChange(format.value)}
                        className={`flex-1 p-3 text-center rounded-lg border-2 transition-all ${selectedFormat === format.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <div className="font-medium text-sm">{format.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{format.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

/**
 * Report Period Selector
 * SRP: Handles only period selection UI
 */
const ReportPeriodSelector: React.FC<{
    selectedPeriod: ReportPeriod;
    onPeriodChange: (period: ReportPeriod) => void;
    startDate?: Date;
    endDate?: Date;
    onDateChange: (startDate: Date, endDate: Date) => void;
}> = ({ selectedPeriod, onPeriodChange, startDate, endDate, onDateChange }) => {
    const periods: { value: ReportPeriod; label: string }[] = [
        { value: 'month', label: 'Ultimo Mese' },
        { value: 'quarter', label: 'Ultimo Trimestre' },
        { value: 'year', label: 'Ultimo Anno' },
        { value: 'custom', label: 'Periodo Personalizzato' }
    ];

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Periodo</label>

            <div className="flex items-center space-x-2">
                {periods.map(period => (
                    <button
                        key={period.value}
                        onClick={() => onPeriodChange(period.value)}
                        className={`px-4 py-2 text-sm rounded transition-colors ${selectedPeriod === period.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {period.label}
                    </button>
                ))}
            </div>

            {/* Custom Date Range */}
            {selectedPeriod === 'custom' && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Data Inizio</label>
                        <input
                            type="date"
                            value={startDate?.toISOString().split('T')[0] || ''}
                            onChange={(e) => {
                                const newStart = new Date(e.target.value);
                                onDateChange(newStart, endDate || new Date());
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Data Fine</label>
                        <input
                            type="date"
                            value={endDate?.toISOString().split('T')[0] || ''}
                            onChange={(e) => {
                                const newEnd = new Date(e.target.value);
                                onDateChange(startDate || new Date(), newEnd);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Report Options Component
 * SRP: Handles only report options UI
 */
const ReportOptions: React.FC<{
    config: ReportConfig;
    onConfigChange: (config: Partial<ReportConfig>) => void;
}> = ({ config, onConfigChange }) => {
    const options = [
        { key: 'includeCharts', label: 'Includi Grafici', description: 'Grafici e visualizzazioni' },
        { key: 'includeRawData', label: 'Includi Dati Grezzi', description: 'Tabelle dettagliate' },
        { key: 'includeAnalytics', label: 'Includi Analytics', description: 'Metriche e KPI' },
        { key: 'includeInsights', label: 'Includi Insights', description: 'Analisi e suggerimenti' }
    ];

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Opzioni Report</label>

            <div className="space-y-2">
                {options.map(option => (
                    <label key={option.key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <input
                            type="checkbox"
                            checked={config[option.key as keyof ReportConfig] as boolean}
                            onChange={(e) => onConfigChange({ [option.key]: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{option.label}</div>
                            <div className="text-xs text-gray-600">{option.description}</div>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

/**
 * Report Preview Component
 * SRP: Handles only report preview rendering
 */
const ReportPreview: React.FC<{
    config: ReportConfig;
    estimatedSize: string;
    estimatedTime: string;
}> = ({ config, estimatedSize, estimatedTime }) => {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">📋 Anteprima Report</h4>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-700">Tipo:</span>
                    <span className="font-medium text-gray-900 capitalize">{config.type}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-700">Formato:</span>
                    <span className="font-medium text-gray-900 uppercase">{config.format}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-700">Periodo:</span>
                    <span className="font-medium text-gray-900 capitalize">{config.period}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-700">Dimensione stimata:</span>
                    <span className="font-medium text-gray-900">{estimatedSize}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-700">Tempo stimato:</span>
                    <span className="font-medium text-gray-900">{estimatedTime}</span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="text-xs text-blue-700">
                    ✅ Inclusi: {[
                        config.includeCharts && 'Grafici',
                        config.includeRawData && 'Dati',
                        config.includeAnalytics && 'Analytics',
                        config.includeInsights && 'Insights'
                    ].filter(Boolean).join(', ')}
                </div>
            </div>
        </div>
    );
};

/**
 * Report Generation Status
 * SRP: Handles only generation status display
 */
const ReportGenerationStatus: React.FC<{
    isGenerating: boolean;
    progress: number;
    currentStep: string;
    error?: string;
}> = ({ isGenerating, progress, currentStep, error }) => {
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h4 className="font-medium text-red-900">Errore Generazione</h4>
                </div>
                <p className="text-red-700 text-sm mt-2">{error}</p>
            </div>
        );
    }

    if (!isGenerating) return null;

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <h4 className="font-medium text-blue-900">Generazione Report in Corso...</h4>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
                <div className="bg-blue-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-blue-700 mt-1">
                    <span>{currentStep}</span>
                    <span>{progress}%</span>
                </div>
            </div>
        </div>
    );
};

/**
 * Report Generator Component (Client-Side for Advanced Features)
 * 
 * SRP Responsibilities:
 * 1. Report generation orchestration ONLY
 * 2. User interface coordination ONLY
 * 3. Configuration management ONLY
 * 
 * NOT responsible for:
 * - Report generation logic (delegated to useReportGenerator)
 * - PDF/Excel processing (delegated to report services)
 * - Data fetching (delegated to analytics hooks)
 * - UI components (delegated to specialized selectors)
 */
export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
    userId,
    onReportGenerated,
    className = ''
}) => {
    // Report configuration state
    const [config, setConfig] = useState<ReportConfig>({
        type: 'financial',
        format: 'pdf',
        period: 'month',
        includeCharts: true,
        includeRawData: true,
        includeAnalytics: true,
        includeInsights: true
    });

    // Use report generator hook
    const {
        generateReport,
        isGenerating,
        progress,
        currentStep,
        error,
        generatedReports
    } = useReportGenerator(userId);

    // Handle configuration changes
    const handleConfigChange = (updates: Partial<ReportConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    };

    // Handle date range changes
    const handleDateChange = (startDate: Date, endDate: Date) => {
        setConfig(prev => ({ ...prev, startDate, endDate }));
    };

    // Handle report generation
    const handleGenerateReport = async () => {
        try {
            const reportUrl = await generateReport(config);
            if (onReportGenerated) {
                onReportGenerated(reportUrl, config);
            }
        } catch (err) {
            console.error('Report generation failed:', err);
        }
    };

    // Calculate estimates
    const estimateSize = () => {
        let baseSize = config.format === 'pdf' ? 2 : config.format === 'excel' ? 1 : 0.5;
        if (config.includeCharts) baseSize += 1;
        if (config.includeRawData) baseSize += 0.5;
        return `${baseSize.toFixed(1)} MB`;
    };

    const estimateTime = () => {
        let baseTime = config.includeCharts ? 30 : 15;
        if (config.includeAnalytics) baseTime += 10;
        if (config.includeInsights) baseTime += 5;
        return `${baseTime}s`;
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">📄 Generatore Report</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Crea report personalizzati dei tuoi dati finanziari
                    </p>
                </div>
                <FileText className="h-6 w-6 text-blue-600" />
            </div>

            {/* Configuration Form */}
            <div className="p-4 space-y-6">
                {/* Report Type */}
                <ReportTypeSelector
                    selectedType={config.type}
                    onTypeChange={(type) => handleConfigChange({ type })}
                />

                {/* Format Selection */}
                <ReportFormatSelector
                    selectedFormat={config.format}
                    onFormatChange={(format) => handleConfigChange({ format })}
                />

                {/* Period Selection */}
                <ReportPeriodSelector
                    selectedPeriod={config.period}
                    onPeriodChange={(period) => handleConfigChange({ period })}
                    startDate={config.startDate}
                    endDate={config.endDate}
                    onDateChange={handleDateChange}
                />

                {/* Report Options */}
                <ReportOptions
                    config={config}
                    onConfigChange={handleConfigChange}
                />

                {/* Report Preview */}
                <ReportPreview
                    config={config}
                    estimatedSize={estimateSize()}
                    estimatedTime={estimateTime()}
                />

                {/* Generation Status */}
                <ReportGenerationStatus
                    isGenerating={isGenerating}
                    progress={progress}
                    currentStep={currentStep}
                    error={error || undefined}
                />

                {/* Generate Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="h-4 w-4" />
                        <span>{isGenerating ? 'Generazione...' : 'Genera Report'}</span>
                    </button>
                </div>
            </div>

            {/* Recent Reports */}
            {generatedReports.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">📁 Report Recenti</h4>
                    <div className="space-y-2">
                        {generatedReports.slice(0, 3).map(report => (
                            <div key={report.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                                    <div className="text-xs text-gray-600">
                                        {report.createdAt.toLocaleDateString('it-IT')} • {report.format.toUpperCase()}
                                    </div>
                                </div>
                                <a
                                    href={report.url}
                                    download
                                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="h-3 w-3" />
                                    <span>Download</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;
