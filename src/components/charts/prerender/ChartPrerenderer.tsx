/**
 * Chart Pre-rendering System
 * 
 * Sistema per generare preview statiche dei charts lato server
 * Con caching intelligente e fallback progressive
 */

import React from 'react';
import { SVGCashFlowChart } from './SVGChartRenderer';
import { SVGTaxBreakdownChart } from './SVGTaxBreakdownChart';
import { SVGTrendChart } from './SVGTrendChart';
import type {
    CashFlowDataPoint,
    TrendDataPoint,
    TaxBreakdownDataPoint,
    ChartConfig
} from '../types';

// =============================================================================
// PRERENDER CONFIGURATION
// =============================================================================

export interface PrerenderConfig {
    enableCaching?: boolean;
    cacheKey?: string;
    cacheTTL?: number; // seconds
    fallbackToSkeleton?: boolean;
    quality?: 'low' | 'medium' | 'high';
}

export const DEFAULT_PRERENDER_CONFIG: PrerenderConfig = {
    enableCaching: true,
    cacheTTL: 3600, // 1 hour
    fallbackToSkeleton: true,
    quality: 'medium'
};

// =============================================================================
// CHART DATA TYPES
// =============================================================================

export type ChartDataType =
    | { type: 'cashflow'; data: CashFlowDataPoint[] }
    | { type: 'trend'; data: TrendDataPoint[] }
    | { type: 'tax'; data: TaxBreakdownDataPoint[] };

export interface PrerenderedChartProps {
    chartData: ChartDataType;
    title?: string;
    subtitle?: string;
    config?: Partial<ChartConfig>;
    prerenderConfig?: PrerenderConfig;
    className?: string;
    width?: number;
    height?: number;
}

// =============================================================================
// QUALITY PRESETS
// =============================================================================

const getQualityPreset = (quality: PrerenderConfig['quality']) => {
    switch (quality) {
        case 'low':
            return { width: 400, height: 200, simplified: true };
        case 'medium':
            return { width: 600, height: 300, simplified: false };
        case 'high':
            return { width: 800, height: 400, simplified: false };
        default:
            return { width: 600, height: 300, simplified: false };
    }
};

// =============================================================================
// CACHE UTILITIES
// =============================================================================

/**
 * Genera cache key per chart
 */
export const generateCacheKey = (
    chartData: ChartDataType,
    config?: Partial<ChartConfig>
): string => {
    const dataHash = JSON.stringify(chartData).slice(0, 50);
    const configHash = JSON.stringify(config || {}).slice(0, 20);
    return `chart_${chartData.type}_${dataHash}_${configHash}`.replace(/[^a-zA-Z0-9]/g, '_');
};

/**
 * Cache in memoria per development (in production usare Redis/Database)
 */
const chartCache = new Map<string, {
    svg: string;
    timestamp: number;
    ttl: number;
}>();

/**
 * Ottieni chart dalla cache
 */
export const getCachedChart = (cacheKey: string): string | null => {
    const cached = chartCache.get(cacheKey);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl * 1000) {
        chartCache.delete(cacheKey);
        return null;
    }

    return cached.svg;
};

/**
 * Salva chart in cache
 */
export const setCachedChart = (
    cacheKey: string,
    svg: string,
    ttl: number = 3600
): void => {
    chartCache.set(cacheKey, {
        svg,
        timestamp: Date.now(),
        ttl
    });
};

// =============================================================================
// MAIN PRERENDERER COMPONENT
// =============================================================================

/**
 * Prerendered Chart Component
 * 
 * Genera preview statiche con caching e fallback intelligenti
 */
export const PrerenderedChart: React.FC<PrerenderedChartProps> = ({
    chartData,
    title,
    subtitle,
    config = {},
    prerenderConfig = {},
    className = '',
    width,
    height
}) => {
    const finalConfig = { ...DEFAULT_PRERENDER_CONFIG, ...prerenderConfig };
    const qualityPreset = getQualityPreset(finalConfig.quality);

    // Override dimensions based on quality
    const finalWidth = width || qualityPreset.width;
    const finalHeight = height || qualityPreset.height;

    // Generate cache key
    const cacheKey = finalConfig.cacheKey || generateCacheKey(chartData, config);

    // Check cache first
    if (finalConfig.enableCaching) {
        const cachedSVG = getCachedChart(cacheKey);
        if (cachedSVG) {
            return (
                <div className={`prerendered-chart ${className}`}>
                    <div dangerouslySetInnerHTML={{ __html: cachedSVG }} />
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-2 text-center">{subtitle}</p>
                    )}
                </div>
            );
        }
    }

    // Render appropriate chart type
    let chartComponent: React.ReactElement;

    try {
        switch (chartData.type) {
            case 'cashflow':
                chartComponent = (
                    <SVGCashFlowChart
                        data={chartData.data}
                        config={{
                            width: finalWidth,
                            height: finalHeight,
                            margin: config?.margin ? {
                                top: config.margin.top ?? 20,
                                right: config.margin.right ?? 30,
                                bottom: config.margin.bottom ?? 40,
                                left: config.margin.left ?? 60
                            } : { top: 20, right: 30, bottom: 40, left: 60 },
                            colors: config?.colors ?? ['#3B82F6', '#EF4444', '#10B981', '#F59E0B']
                        }}
                        title={title}
                    />
                );
                break;

            case 'trend':
                chartComponent = (
                    <SVGTrendChart
                        data={chartData.data}
                        config={{
                            width: finalWidth,
                            height: finalHeight,
                            margin: config?.margin ? {
                                top: config.margin.top ?? 20,
                                right: config.margin.right ?? 30,
                                bottom: config.margin.bottom ?? 40,
                                left: config.margin.left ?? 60
                            } : { top: 20, right: 30, bottom: 40, left: 60 },
                            colors: config?.colors ?? ['#3B82F6', '#EF4444', '#10B981', '#F59E0B']
                        }}
                        title={title}
                    />
                );
                break;

            case 'tax':
                chartComponent = (
                    <SVGTaxBreakdownChart
                        data={chartData.data}
                        config={{
                            width: finalWidth,
                            height: finalHeight,
                            margin: config?.margin ? {
                                top: config.margin.top ?? 20,
                                right: config.margin.right ?? 30,
                                bottom: config.margin.bottom ?? 40,
                                left: config.margin.left ?? 60
                            } : { top: 20, right: 30, bottom: 40, left: 60 },
                            colors: config?.colors ?? ['#3B82F6', '#EF4444', '#10B981', '#F59E0B']
                        }}
                        title={title}
                        showPercentages={true}
                    />
                );
                break;

            default:
                // TypeScript exhaustiveness check
                const _exhaustiveCheck: never = chartData;
                throw new Error(`Unsupported chart type: ${(_exhaustiveCheck as ChartDataType).type}`);
        }

        // Cache the rendered component (in a real app, you'd serialize the SVG)
        if (finalConfig.enableCaching && finalConfig.cacheTTL) {
            const svgString = `<!-- Cached chart for ${chartData.type} -->`;
            setCachedChart(cacheKey, svgString, finalConfig.cacheTTL);
        }

        return (
            <div className={`prerendered-chart ${className}`}>
                {chartComponent}
                {subtitle && (
                    <p className="text-sm text-gray-600 mt-2 text-center">{subtitle}</p>
                )}

                {/* Debug info in development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-gray-400 mt-1">
                        Prerendered • Quality: {finalConfig.quality} • Cached: {!!finalConfig.enableCaching}
                    </div>
                )}
            </div>
        );

    } catch (error) {
        console.warn('Chart prerendering failed:', error);

        // Fallback to skeleton or error state
        if (finalConfig.fallbackToSkeleton) {
            return (
                <div className={`prerendered-chart-fallback ${className}`}>
                    <div
                        className="bg-gray-200 rounded animate-pulse flex items-center justify-center"
                        style={{ width: finalWidth, height: finalHeight }}
                    >
                        <span className="text-gray-500 text-sm">Chart Preview</span>
                    </div>
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-2 text-center">{subtitle}</p>
                    )}
                </div>
            );
        }

        return (
            <div className={`prerendered-chart-error ${className}`}>
                <div className="text-red-500 text-center p-4">
                    Chart rendering failed
                </div>
            </div>
        );
    }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Genera preview rapida per dashboard
 */
export const QuickChartPreview: React.FC<{
    type: 'cashflow' | 'trend' | 'tax';
    data: Record<string, unknown>[];
    title?: string;
}> = ({ type, data, title }) => {
    const chartData = { type, data } as ChartDataType;

    return (
        <PrerenderedChart
            chartData={chartData}
            title={title}
            prerenderConfig={{
                quality: 'low',
                enableCaching: true,
                cacheTTL: 1800 // 30 minutes for quick previews
            }}
            className="quick-preview"
        />
    );
};

/**
 * Pulisce cache scadute
 */
export const clearExpiredCache = (): number => {
    const now = Date.now();
    let cleared = 0;

    for (const [key, value] of chartCache.entries()) {
        if (now - value.timestamp > value.ttl * 1000) {
            chartCache.delete(key);
            cleared++;
        }
    }

    return cleared;
};

/**
 * Ottieni statistiche cache
 */
export const getCacheStats = () => {
    return {
        size: chartCache.size,
        keys: Array.from(chartCache.keys())
    };
};

export default PrerenderedChart;
