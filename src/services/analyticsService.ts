/**
 * Analytics Service
 *
 * SRP: Handles ONLY analytics data processing and calculations
 * Advanced analytics service for business intelligence
 */

import {
  KPIMetric,
  BusinessInsight,
  ChartAnalyticsData,
} from "@/components/charts/advanced/types";
import { AnalyticsPeriod } from "@/components/analytics/BusinessAnalytics";

/**
 * Analytics Data Interface
 * SRP: Defines only analytics service data structure
 */
export interface AnalyticsServiceData {
  invoices: {
    issueDate: string;
    amount: number;
    clientName: string;
    category?: string;
  }[];
  costs: { date: string; amount: number; description: string }[];
  period: AnalyticsPeriod;
}

/**
 * KPI Calculator Service
 * SRP: Handles only KPI calculations
 */
export class KPICalculatorService {
  /**
   * Calculate Financial KPIs
   * SRP: Calculates only financial performance metrics
   */
  static calculateFinancialKPIs(data: AnalyticsServiceData): KPIMetric[] {
    const { invoices, costs, period } = data;
    const monthsToAnalyze = this.getMonthsFromPeriod(period);

    // Filter data for current period
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsToAnalyze);

    const currentInvoices = invoices.filter(
      (inv) => new Date(inv.issueDate) >= cutoffDate
    );
    const currentCosts = costs.filter(
      (cost) => new Date(cost.date) >= cutoffDate
    );

    // Filter data for previous period (for comparison)
    const prevCutoffDate = new Date(cutoffDate);
    prevCutoffDate.setMonth(prevCutoffDate.getMonth() - monthsToAnalyze);

    const prevInvoices = invoices.filter((inv) => {
      const date = new Date(inv.issueDate);
      return date >= prevCutoffDate && date < cutoffDate;
    });
    const prevCosts = costs.filter((cost) => {
      const date = new Date(cost.date);
      return date >= prevCutoffDate && date < cutoffDate;
    });

    // Calculate current metrics
    const currentRevenue = currentInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const currentCostTotal = currentCosts.reduce(
      (sum, cost) => sum + cost.amount,
      0
    );
    const currentProfit = currentRevenue - currentCostTotal;
    const currentMargin =
      currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0;

    // Calculate previous metrics
    const prevRevenue = prevInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const prevCostTotal = prevCosts.reduce((sum, cost) => sum + cost.amount, 0);
    const prevProfit = prevRevenue - prevCostTotal;
    const prevMargin = prevRevenue > 0 ? (prevProfit / prevRevenue) * 100 : 0;

    // Calculate trends
    const revenueTrend =
      prevRevenue > 0
        ? ((currentRevenue - prevRevenue) / prevRevenue) * 100
        : 0;
    const costTrend =
      prevCostTotal > 0
        ? ((currentCostTotal - prevCostTotal) / prevCostTotal) * 100
        : 0;
    const profitTrend =
      prevProfit !== 0
        ? ((currentProfit - prevProfit) / Math.abs(prevProfit)) * 100
        : 0;
    const marginTrend = currentMargin - prevMargin;

    // Client diversity
    const uniqueClients = new Set(currentInvoices.map((inv) => inv.clientName))
      .size;
    const prevUniqueClients = new Set(prevInvoices.map((inv) => inv.clientName))
      .size;
    const clientDiversityTrend =
      prevUniqueClients > 0
        ? ((uniqueClients - prevUniqueClients) / prevUniqueClients) * 100
        : 0;

    // Average invoice value
    const avgInvoiceValue =
      currentInvoices.length > 0 ? currentRevenue / currentInvoices.length : 0;
    const prevAvgInvoiceValue =
      prevInvoices.length > 0 ? prevRevenue / prevInvoices.length : 0;
    const avgInvoiceTrend =
      prevAvgInvoiceValue > 0
        ? ((avgInvoiceValue - prevAvgInvoiceValue) / prevAvgInvoiceValue) * 100
        : 0;

    return [
      {
        id: "revenue",
        name: "Ricavi Totali",
        value: currentRevenue,
        previousValue: prevRevenue,
        unit: "currency",
        trend: revenueTrend > 5 ? "up" : revenueTrend < -5 ? "down" : "stable",
        trendPercentage: revenueTrend,
        status:
          revenueTrend > 0
            ? "good"
            : revenueTrend < -10
            ? "critical"
            : "warning",
        description: `Ricavi degli ultimi ${monthsToAnalyze} mesi`,
      },
      {
        id: "costs",
        name: "Costi Totali",
        value: currentCostTotal,
        previousValue: prevCostTotal,
        unit: "currency",
        trend: costTrend < -5 ? "up" : costTrend > 5 ? "down" : "stable",
        trendPercentage: -costTrend, // Inverted for costs
        status:
          costTrend < 0 ? "good" : costTrend > 15 ? "critical" : "warning",
        description: `Costi degli ultimi ${monthsToAnalyze} mesi`,
      },
      {
        id: "profit",
        name: "Profitto Netto",
        value: currentProfit,
        previousValue: prevProfit,
        unit: "currency",
        trend: profitTrend > 5 ? "up" : profitTrend < -5 ? "down" : "stable",
        trendPercentage: profitTrend,
        status:
          currentProfit > 0 && profitTrend > 0
            ? "good"
            : currentProfit < 0
            ? "critical"
            : "warning",
        description: `Profitto netto degli ultimi ${monthsToAnalyze} mesi`,
      },
      {
        id: "margin",
        name: "Margine di Profitto",
        value: currentMargin,
        previousValue: prevMargin,
        target: 20,
        unit: "percentage",
        trend: marginTrend > 2 ? "up" : marginTrend < -2 ? "down" : "stable",
        trendPercentage: marginTrend,
        status:
          currentMargin > 20
            ? "good"
            : currentMargin < 10
            ? "critical"
            : "warning",
        description: "Margine di profittabilità",
      },
      {
        id: "client-diversity",
        name: "Diversificazione Clienti",
        value: uniqueClients,
        previousValue: prevUniqueClients,
        target: Math.max(5, uniqueClients * 1.2),
        unit: "number",
        trend:
          clientDiversityTrend > 10
            ? "up"
            : clientDiversityTrend < -10
            ? "down"
            : "stable",
        trendPercentage: clientDiversityTrend,
        status:
          uniqueClients > 5
            ? "good"
            : uniqueClients < 3
            ? "critical"
            : "warning",
        description: "Numero di clienti attivi",
      },
      {
        id: "avg-invoice",
        name: "Valore Medio Fattura",
        value: avgInvoiceValue,
        previousValue: prevAvgInvoiceValue,
        unit: "currency",
        trend:
          avgInvoiceTrend > 5 ? "up" : avgInvoiceTrend < -5 ? "down" : "stable",
        trendPercentage: avgInvoiceTrend,
        status:
          avgInvoiceTrend > 0
            ? "good"
            : avgInvoiceTrend < -15
            ? "critical"
            : "warning",
        description: "Valore medio delle fatture",
      },
    ];
  }

  /**
   * Get months from period
   * SRP: Converts period to months count
   */
  private static getMonthsFromPeriod(period: AnalyticsPeriod): number {
    switch (period) {
      case "3months":
        return 3;
      case "6months":
        return 6;
      case "12months":
        return 12;
      case "24months":
        return 24;
      default:
        return 6;
    }
  }
}

/**
 * Business Insights Generator Service
 * SRP: Handles only business insights generation
 */
export class BusinessInsightsService {
  /**
   * Generate Business Insights
   * SRP: Generates only actionable business insights
   */
  static generateInsights(
    kpis: KPIMetric[],
    data: AnalyticsServiceData
  ): BusinessInsight[] {
    const insights: BusinessInsight[] = [];

    // Revenue insights
    const revenueKPI = kpis.find((k) => k.id === "revenue");
    if (revenueKPI) {
      if (revenueKPI.trendPercentage > 20) {
        insights.push({
          id: "revenue-growth-opportunity",
          type: "opportunity",
          title: "Forte Crescita Ricavi",
          description: `I ricavi sono cresciuti del ${revenueKPI.trendPercentage.toFixed(
            1
          )}%. Momento ideale per espansione.`,
          impact: "high",
          confidence: 95,
          actionable: true,
          suggestedActions: [
            "Aumenta la capacità produttiva",
            "Investi in marketing per scalare",
            "Considera di aumentare i prezzi",
            "Espandi il team o i servizi",
          ],
        });
      } else if (revenueKPI.trendPercentage < -15) {
        insights.push({
          id: "revenue-decline-risk",
          type: "risk",
          title: "Calo Ricavi Significativo",
          description: `I ricavi sono calati del ${Math.abs(
            revenueKPI.trendPercentage
          ).toFixed(1)}%. Intervento urgente necessario.`,
          impact: "high",
          confidence: 90,
          actionable: true,
          suggestedActions: [
            "Analizza la perdita di clienti",
            "Rivedi la strategia di pricing",
            "Intensifica le attività di marketing",
            "Diversifica i servizi offerti",
            "Contatta i clienti inattivi",
          ],
        });
      }
    }

    // Client diversity insights
    const clientKPI = kpis.find((k) => k.id === "client-diversity");
    if (clientKPI && clientKPI.value < 3) {
      insights.push({
        id: "client-concentration-risk",
        type: "risk",
        title: "Concentrazione Clienti Elevata",
        description: `Solo ${clientKPI.value} clienti attivi. Rischio di dipendenza eccessiva.`,
        impact: "high",
        confidence: 85,
        actionable: true,
        suggestedActions: [
          "Acquisisci nuovi clienti",
          "Diversifica i settori di mercato",
          "Implementa strategie di retention",
          "Crea partnership strategiche",
        ],
      });
    }

    // Profit margin insights
    const marginKPI = kpis.find((k) => k.id === "margin");
    if (marginKPI) {
      if (marginKPI.value < 10) {
        insights.push({
          id: "low-margin-risk",
          type: "risk",
          title: "Margine di Profitto Critico",
          description: `Margine del ${marginKPI.value.toFixed(
            1
          )}% sotto la soglia di sostenibilità.`,
          impact: "high",
          confidence: 95,
          actionable: true,
          suggestedActions: [
            "Aumenta i prezzi dei servizi",
            "Riduci i costi operativi non essenziali",
            "Migliora l'efficienza dei processi",
            "Focalizzati su servizi ad alto valore",
            "Rinegozia i contratti con i fornitori",
          ],
        });
      } else if (marginKPI.value > 35) {
        insights.push({
          id: "high-margin-opportunity",
          type: "opportunity",
          title: "Margine Eccellente",
          description: `Margine del ${marginKPI.value.toFixed(
            1
          )}%. Ottima opportunità di investimento.`,
          impact: "medium",
          confidence: 90,
          actionable: true,
          suggestedActions: [
            "Investi in nuove tecnologie",
            "Espandi il business",
            "Crea un fondo di riserva",
            "Considera nuovi mercati",
          ],
        });
      }
    }

    // Average invoice insights
    const avgInvoiceKPI = kpis.find((k) => k.id === "avg-invoice");
    if (avgInvoiceKPI && avgInvoiceKPI.trendPercentage < -20) {
      insights.push({
        id: "declining-invoice-value",
        type: "trend",
        title: "Valore Fatture in Calo",
        description: `Il valore medio delle fatture è calato del ${Math.abs(
          avgInvoiceKPI.trendPercentage
        ).toFixed(1)}%.`,
        impact: "medium",
        confidence: 80,
        actionable: true,
        suggestedActions: [
          "Rivedi la strategia di pricing",
          "Offri servizi premium",
          "Implementa upselling e cross-selling",
          "Analizza la competizione",
        ],
      });
    }

    // Seasonal analysis
    const seasonalInsight = this.analyzeSeasonality(data.invoices);
    if (seasonalInsight) {
      insights.push(seasonalInsight);
    }

    // Cost efficiency analysis
    const costEfficiencyInsight = this.analyzeCostEfficiency(
      data.costs,
      revenueKPI?.value || 0
    );
    if (costEfficiencyInsight) {
      insights.push(costEfficiencyInsight);
    }

    return insights;
  }

  /**
   * Analyze Seasonality
   * SRP: Analyzes only seasonal patterns
   */
  private static analyzeSeasonality(
    invoices: { issueDate: string; amount: number }[]
  ): BusinessInsight | null {
    if (invoices.length < 12) return null;

    const monthlyRevenue = invoices.reduce((acc, inv) => {
      const month = new Date(inv.issueDate).getMonth();
      acc[month] = (acc[month] || 0) + inv.amount;
      return acc;
    }, {} as Record<number, number>);

    const revenueValues = Object.values(monthlyRevenue);
    const avgRevenue =
      revenueValues.reduce((sum, val) => sum + val, 0) / revenueValues.length;
    const variance =
      revenueValues.reduce(
        (sum, val) => sum + Math.pow(val - avgRevenue, 2),
        0
      ) / revenueValues.length;
    const volatility = Math.sqrt(variance) / avgRevenue;

    if (volatility > 0.4) {
      return {
        id: "seasonal-volatility",
        type: "trend",
        title: "Alta Stagionalità Rilevata",
        description: `I ricavi mostrano alta variabilità stagionale (${(
          volatility * 100
        ).toFixed(1)}% di volatilità).`,
        impact: "medium",
        confidence: 85,
        actionable: true,
        suggestedActions: [
          "Pianifica il cash flow per compensare i mesi bassi",
          "Diversifica i servizi per ridurre la stagionalità",
          "Crea contratti ricorrenti per stabilizzare i ricavi",
          "Sviluppa prodotti passivi per i periodi lenti",
        ],
      };
    }

    return null;
  }

  /**
   * Analyze Cost Efficiency
   * SRP: Analyzes only cost efficiency patterns
   */
  private static analyzeCostEfficiency(
    costs: { date: string; amount: number; description: string }[],
    totalRevenue: number
  ): BusinessInsight | null {
    if (costs.length === 0 || totalRevenue === 0) return null;

    const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0);
    const costRatio = totalCosts / totalRevenue;

    // Find most expensive cost item
    const highestCost = costs.sort((a, b) => b.amount - a.amount)[0];

    if (costRatio > 0.7) {
      return {
        id: "high-cost-ratio",
        type: "risk",
        title: "Rapporto Costi/Ricavi Elevato",
        description: `I costi rappresentano il ${(costRatio * 100).toFixed(
          1
        )}% dei ricavi. Costo maggiore: ${highestCost?.description || "N/A"}.`,
        impact: "high",
        confidence: 90,
        actionable: true,
        suggestedActions: [
          "Analizza i costi più significativi",
          "Rinegozia i contratti con i fornitori",
          "Automatizza i processi per ridurre i costi operativi",
          "Cerca alternative più economiche",
        ],
      };
    }

    return null;
  }

  /**
   * Get months from period helper
   * SRP: Converts period enum to number
   */
  private static getMonthsFromPeriod(period: AnalyticsPeriod): number {
    switch (period) {
      case "3months":
        return 3;
      case "6months":
        return 6;
      case "12months":
        return 12;
      case "24months":
        return 24;
      default:
        return 6;
    }
  }
}

/**
 * Chart Analytics Data Processor
 * SRP: Handles only chart data processing for analytics
 */
export class ChartAnalyticsProcessor {
  /**
   * Process Revenue Data for Charts
   * SRP: Processes only revenue data for visualization
   */
  static processRevenueData(
    invoices: { issueDate: string; amount: number }[],
    period: AnalyticsPeriod
  ): ChartAnalyticsData {
    const monthsToAnalyze = this.getMonthsFromPeriod(period);
    const monthlyData = this.generateMonthlyData(
      invoices,
      monthsToAnalyze,
      "revenue"
    );

    return {
      primary: monthlyData,
      metadata: {
        period: `${monthsToAnalyze} mesi`,
        currency: "EUR",
        lastUpdated: new Date(),
        dataSource: "Revenue Analytics",
      },
    };
  }

  /**
   * Process Cost Data for Charts
   * SRP: Processes only cost data for visualization
   */
  static processCostData(
    costs: { date: string; amount: number; description: string }[],
    period: AnalyticsPeriod
  ): ChartAnalyticsData {
    const monthsToAnalyze = this.getMonthsFromPeriod(period);
    const monthlyData = this.generateMonthlyData(
      costs,
      monthsToAnalyze,
      "cost"
    );

    // Secondary data: cost by description (top 10)
    const costByDescription = costs
      .reduce((acc, cost) => {
        const desc = cost.description;
        const existing = acc.find((item) => item.name === desc);
        if (existing) {
          existing.value = (existing.value as number) + cost.amount;
        } else {
          acc.push({
            id: desc,
            name: desc,
            value: cost.amount,
            description: desc,
          });
        }
        return acc;
      }, [] as Record<string, unknown>[])
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 10); // Top 10 cost items

    return {
      primary: monthlyData,
      secondary: costByDescription,
      metadata: {
        period: `${monthsToAnalyze} mesi`,
        currency: "EUR",
        lastUpdated: new Date(),
        dataSource: "Cost Analytics",
      },
    };
  }

  /**
   * Process Profit Data for Charts
   * SRP: Processes only profit data for visualization
   */
  static processProfitData(
    invoices: { issueDate: string; amount: number }[],
    costs: { date: string; amount: number }[],
    period: AnalyticsPeriod
  ): ChartAnalyticsData {
    const monthsToAnalyze = this.getMonthsFromPeriod(period);

    // Generate monthly profit data
    const monthlyData = [];
    for (let i = monthsToAnalyze - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);

      const monthInvoices = invoices.filter((inv) =>
        inv.issueDate.startsWith(monthKey)
      );
      const monthCosts = costs.filter((cost) => cost.date.startsWith(monthKey));

      const monthRevenue = monthInvoices.reduce(
        (sum, inv) => sum + inv.amount,
        0
      );
      const monthCostTotal = monthCosts.reduce(
        (sum, cost) => sum + cost.amount,
        0
      );
      const monthProfit = monthRevenue - monthCostTotal;

      monthlyData.push({
        id: monthKey,
        name: date.toLocaleDateString("it-IT", {
          month: "short",
          year: "numeric",
        }),
        date: monthKey,
        value: monthProfit,
        revenue: monthRevenue,
        costs: monthCostTotal,
        margin: monthRevenue > 0 ? (monthProfit / monthRevenue) * 100 : 0,
      });
    }

    return {
      primary: monthlyData,
      metadata: {
        period: `${monthsToAnalyze} mesi`,
        currency: "EUR",
        lastUpdated: new Date(),
        dataSource: "Profit Analytics",
      },
    };
  }

  /**
   * Generate Monthly Data
   * SRP: Generates only monthly aggregated data
   */
  private static generateMonthlyData(
    data: { date?: string; issueDate?: string; amount: number }[],
    months: number,
    _type: "revenue" | "cost"
  ): Record<string, unknown>[] {
    const monthlyData = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);

      const monthData = data.filter((item) => {
        const itemDate = item.issueDate || item.date || "";
        return itemDate.startsWith(monthKey);
      });

      const monthTotal = monthData.reduce((sum, item) => sum + item.amount, 0);

      monthlyData.push({
        id: monthKey,
        name: date.toLocaleDateString("it-IT", {
          month: "short",
          year: "numeric",
        }),
        date: monthKey,
        value: monthTotal,
        count: monthData.length,
      });
    }

    return monthlyData;
  }

  /**
   * Get months from period helper
   * SRP: Converts period enum to number
   */
  private static getMonthsFromPeriod(period: AnalyticsPeriod): number {
    switch (period) {
      case "3months":
        return 3;
      case "6months":
        return 6;
      case "12months":
        return 12;
      case "24months":
        return 24;
      default:
        return 6;
    }
  }
}

/**
 * Analytics Service Main Class
 * SRP: Orchestrates only analytics service operations
 */
export class AnalyticsService {
  /**
   * Get Complete Analytics
   * SRP: Orchestrates only complete analytics data retrieval
   */
  static async getCompleteAnalytics(
    userId: string,
    period: AnalyticsPeriod
  ): Promise<{
    kpis: KPIMetric[];
    insights: BusinessInsight[];
    revenueData: ChartAnalyticsData;
    costData: ChartAnalyticsData;
    profitData: ChartAnalyticsData;
  }> {
    // This would typically fetch from API
    // For now, return mock data structure
    const mockData: AnalyticsServiceData = {
      invoices: [],
      costs: [],
      period,
    };

    const kpis = KPICalculatorService.calculateFinancialKPIs(mockData);
    const insights = BusinessInsightsService.generateInsights(kpis, mockData);

    const revenueData = ChartAnalyticsProcessor.processRevenueData(
      mockData.invoices,
      period
    );
    const costData = ChartAnalyticsProcessor.processCostData(
      mockData.costs,
      period
    );
    const profitData = ChartAnalyticsProcessor.processProfitData(
      mockData.invoices,
      mockData.costs,
      period
    );

    return {
      kpis,
      insights,
      revenueData,
      costData,
      profitData,
    };
  }
}
