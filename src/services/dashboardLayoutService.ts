/**
 * Dashboard Layout Service
 *
 * SRP: Handles ONLY dashboard layout API communication
 * Service layer for dashboard layout operations
 */

import { api } from "./api";
import { DashboardLayout } from "@/components/widgets/base/types";

/**
 * Dashboard Layout Service
 * SRP: Handles only layout-related API calls
 */
export const dashboardLayoutService = {
  /**
   * Get user's default dashboard layout
   */
  async getDefaultLayout(): Promise<DashboardLayout | null> {
    try {
      const response = await api.get<DashboardLayout>(
        "/dashboard/layout?default=true"
      );
      return response || null;
    } catch (error) {
      console.error("Failed to get default layout:", error);
      return null;
    }
  },

  /**
   * Get specific dashboard layout by ID
   */
  async getLayout(layoutId: string): Promise<DashboardLayout | null> {
    try {
      const response = await api.get<DashboardLayout>(
        `/dashboard/layout?id=${layoutId}`
      );
      return response || null;
    } catch (error) {
      console.error("Failed to get layout:", error);
      return null;
    }
  },

  /**
   * Get all user dashboard layouts
   */
  async getAllLayouts(): Promise<DashboardLayout[]> {
    try {
      const response = await api.get<DashboardLayout[]>("/dashboard/layout");
      return response || [];
    } catch (error) {
      console.error("Failed to get layouts:", error);
      return [];
    }
  },

  /**
   * Create new dashboard layout
   */
  async createLayout(
    layout: Omit<DashboardLayout, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<DashboardLayout> {
    const response = await api.post<DashboardLayout>(
      "/dashboard/layout",
      layout
    );
    return response;
  },

  /**
   * Update existing dashboard layout
   */
  async updateLayout(
    layoutId: string,
    updates: Partial<DashboardLayout>
  ): Promise<DashboardLayout> {
    const response = await api.put<DashboardLayout>("/dashboard/layout", {
      id: layoutId,
      ...updates,
    });
    return response;
  },

  /**
   * Delete dashboard layout
   */
  async deleteLayout(layoutId: string): Promise<void> {
    await api.delete<void>(`/dashboard/layout?id=${layoutId}`);
  },

  /**
   * Set layout as default
   */
  async setDefaultLayout(layoutId: string): Promise<DashboardLayout> {
    return this.updateLayout(layoutId, { isDefault: true });
  },

  /**
   * Duplicate existing layout
   */
  async duplicateLayout(
    layoutId: string,
    newName: string
  ): Promise<DashboardLayout> {
    const existingLayout = await this.getLayout(layoutId);
    if (!existingLayout) {
      throw new Error("Layout not found");
    }

    const duplicatedLayout = {
      name: newName,
      isDefault: false,
      widgets: existingLayout.widgets.map((widget) => ({
        ...widget,
        id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
      layoutSettings: existingLayout.layoutSettings,
    };

    return this.createLayout(duplicatedLayout);
  },
};
