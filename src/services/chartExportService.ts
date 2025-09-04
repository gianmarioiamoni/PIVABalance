/**
 * Chart Export Service
 *
 * SRP: Handles ONLY chart export functionality
 * Advanced chart export service with multiple format support
 */

import { ChartExportOptions } from "@/components/charts/advanced/types";

/**
 * Export Format Handler Interface
 * SRP: Defines only export format handling
 */
interface ExportFormatHandler {
  format: string;
  mimeType: string;
  fileExtension: string;
  export: (
    chartElement: HTMLElement,
    options: ChartExportOptions
  ) => Promise<string>;
}

/**
 * PNG Export Handler
 * SRP: Handles only PNG export functionality
 */
class PNGExportHandler implements ExportFormatHandler {
  format = "png";
  mimeType = "image/png";
  fileExtension = "png";

  async export(
    chartElement: HTMLElement,
    _options: ChartExportOptions
  ): Promise<string> {
    // Use html2canvas for PNG export
    const html2canvas = await import("html2canvas");

    const canvas = await html2canvas.default(chartElement, {
      background: "#ffffff",
      logging: false,
      useCORS: true,
    });

    return canvas.toDataURL(this.mimeType);
  }
}

/**
 * SVG Export Handler
 * SRP: Handles only SVG export functionality
 */
class SVGExportHandler implements ExportFormatHandler {
  format = "svg";
  mimeType = "image/svg+xml";
  fileExtension = "svg";

  async export(
    chartElement: HTMLElement,
    _options: ChartExportOptions
  ): Promise<string> {
    // Find SVG element within the chart
    const svgElement = chartElement.querySelector("svg");
    if (!svgElement) {
      throw new Error("SVG element not found in chart");
    }

    // Clone and enhance SVG
    const clonedSVG = svgElement.cloneNode(true) as SVGElement;

    // Add background
    const background = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    background.setAttribute("width", "100%");
    background.setAttribute("height", "100%");
    background.setAttribute("fill", "#ffffff");
    clonedSVG.insertBefore(background, clonedSVG.firstChild);

    // Serialize SVG
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSVG);

    // Create data URL
    return `data:${this.mimeType};base64,${btoa(svgString)}`;
  }
}

/**
 * PDF Export Handler
 * SRP: Handles only PDF export functionality
 */
class PDFExportHandler implements ExportFormatHandler {
  format = "pdf";
  mimeType = "application/pdf";
  fileExtension = "pdf";

  async export(
    chartElement: HTMLElement,
    _options: ChartExportOptions
  ): Promise<string> {
    // Use jsPDF for PDF export
    const jsPDF = await import("jspdf");
    const html2canvas = await import("html2canvas");

    const canvas = await html2canvas.default(chartElement, {
      background: "#ffffff",
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF.jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

    return pdf.output("datauristring");
  }
}

/**
 * Excel Export Handler
 * SRP: Handles only Excel export functionality
 */
class ExcelExportHandler implements ExportFormatHandler {
  format = "excel";
  mimeType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  fileExtension = "xlsx";

  async export(
    chartElement: HTMLElement,
    options: ChartExportOptions
  ): Promise<string> {
    if (!options.includeData) {
      throw new Error("Excel export requires data to be included");
    }

    // This would integrate with a library like SheetJS
    // For now, return a mock Excel data URL
    const mockExcelData = this.generateMockExcelData();
    return `data:${this.mimeType};base64,${btoa(mockExcelData)}`;
  }

  private generateMockExcelData(): string {
    // Mock Excel content
    return "PK\x03\x04..."; // Would be actual Excel binary data
  }
}

/**
 * Export Handler Registry
 * SRP: Manages only export format handlers
 */
class ExportHandlerRegistry {
  private static handlers: Map<string, ExportFormatHandler> = new Map([
    ["png", new PNGExportHandler()],
    ["svg", new SVGExportHandler()],
    ["pdf", new PDFExportHandler()],
    ["excel", new ExcelExportHandler()],
  ]);

  static getHandler(format: string): ExportFormatHandler {
    const handler = this.handlers.get(format);
    if (!handler) {
      throw new Error(`Export format '${format}' not supported`);
    }
    return handler;
  }

  static getSupportedFormats(): string[] {
    return Array.from(this.handlers.keys());
  }
}

/**
 * Chart Export Service
 * SRP: Orchestrates only chart export operations
 */
export class ChartExportService {
  /**
   * Export Chart
   * SRP: Handles only chart export orchestration
   */
  static async exportChart(
    chartElement: HTMLElement,
    options: ChartExportOptions
  ): Promise<string> {
    try {
      const handler = ExportHandlerRegistry.getHandler(options.format);
      const dataUrl = await handler.export(chartElement, options);

      // Trigger download
      const link = document.createElement("a");
      link.download =
        options.filename || `chart-export.${handler.fileExtension}`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return dataUrl;
    } catch (error) {
      console.error("Chart export failed:", error);
      throw new Error(
        `Export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Export Multiple Charts
   * SRP: Handles only multiple chart export
   */
  static async exportMultipleCharts(
    charts: { element: HTMLElement; name: string }[],
    options: ChartExportOptions
  ): Promise<string[]> {
    const results: string[] = [];

    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i];
      const chartOptions = {
        ...options,
        filename: `${chart.name}-${options.filename || "export"}.${
          ExportHandlerRegistry.getHandler(options.format).fileExtension
        }`,
      };

      try {
        const dataUrl = await this.exportChart(chart.element, chartOptions);
        results.push(dataUrl);
      } catch (error) {
        console.error(`Failed to export chart ${chart.name}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Get Supported Formats
   * SRP: Returns only supported export formats
   */
  static getSupportedFormats(): string[] {
    return ExportHandlerRegistry.getSupportedFormats();
  }

  /**
   * Validate Export Options
   * SRP: Validates only export options
   */
  static validateExportOptions(options: ChartExportOptions): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!ExportHandlerRegistry.getSupportedFormats().includes(options.format)) {
      errors.push(`Format '${options.format}' not supported`);
    }

    if (options.format === "excel" && !options.includeData) {
      errors.push("Excel export requires includeData to be true");
    }

    if (
      options.quality &&
      !["low", "medium", "high"].includes(options.quality)
    ) {
      errors.push("Quality must be low, medium, or high");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
