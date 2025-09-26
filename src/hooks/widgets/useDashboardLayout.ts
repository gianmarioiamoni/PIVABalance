/**
 * Dashboard Layout Hook
 *
 * SRP: Handles ONLY dashboard layout state management and persistence
 * Specialized hook for dashboard customization logic
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  WidgetConfig,
  DashboardLayout,
  WidgetPosition,
  WidgetType,
  WidgetSize,
} from "@/components/widgets/base/types";
import { WidgetRegistry } from "@/components/widgets/registry/WidgetRegistry";
import { useNotifications } from "@/providers/NotificationProvider";
import { dashboardLayoutService } from "@/services/dashboardLayoutService";

// Type for layout with MongoDB _id (returned from database)
type DashboardLayoutWithMongoId = DashboardLayout & { _id?: string };

/**
 * Dashboard Layout API Service (Legacy - now using dashboardLayoutService)
 * SRP: Handles only layout API communication
 */
// const dashboardLayoutAPI = { // Replaced by dashboardLayoutService
/*
  async getLayout(layoutId?: string): Promise<DashboardLayout | null> {
    try {
      const url = layoutId 
        ? `/api/dashboard/layout?id=${layoutId}`
        : '/api/dashboard/layout?default=true';
      
      const response = await fetch(url);
      const result = await response.json();

      if (!result.success) {
        if (response.status === 404 || !result.data) {
          // Return system default layout
          return _createDefaultLayout();
        }
        throw new Error(result.message);
      }

      return result.data;
    } catch (error) {
      console.error('Failed to fetch layout:', error);
      // Fallback to system default
      return _createDefaultLayout();
    }
  },

  async saveLayout(layout: DashboardLayout): Promise<DashboardLayout> {
    const response = await fetch('/api/dashboard/layout', {
      method: layout.id && layout.id !== 'default' ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(layout.id && layout.id !== 'default' ? { id: layout.id, ...layout } : layout)
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  }
}; */

/**
 * Create Default Layout
 * SRP: Handles only default layout creation
 */
// Default layout creation logic moved to WidgetRegistry.getDefaultLayout()

/**
 * Widget Position Utilities
 * SRP: Handles only position calculation logic
 */
const positionUtils = {
  /**
   * Find next available position for widget
   */
  findNextPosition(
    existingWidgets: WidgetConfig[],
    widgetSize: WidgetConfig["size"],
    columns: number = 24  // Doubled for finer positioning
  ): WidgetPosition {
    const sizeMap = {
      small: { w: 6, h: 2 },    // 25% width, finer height
      medium: { w: 12, h: 3 },  // 50% width, finer height  
      large: { w: 12, h: 4 },   // 50% width, taller
      full: { w: 24, h: 4 },    // 100% width, finer height
    };

    const { w, h } = sizeMap[widgetSize];

    // Increase search area for better placement
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x <= columns - w; x++) {
        const position = { x, y, w, h };
        
        // Enhanced collision check - ensure we don't overlap
        if (!this.hasCollision(position, existingWidgets)) {
          return position;
        }
      }
    }

    // If no position found after exhaustive search, place at bottom
    const maxY = Math.max(
      0,
      ...existingWidgets.map((w) => w.position.y + w.position.h)
    );
    return { x: 0, y: maxY, w, h };
  },

  /**
   * Check if position collides with existing widgets
   */
  hasCollision(position: WidgetPosition, widgets: WidgetConfig[]): boolean {
    return widgets.some((widget) => {
      const w = widget.position;
      return !(
        position.x >= w.x + w.w ||
        position.x + position.w <= w.x ||
        position.y >= w.y + w.h ||
        position.y + position.h <= w.y
      );
    });
  },

  /**
   * Reorganize widgets to avoid overlaps after moving one widget
   */
  reorganizeWidgets(
    widgets: WidgetConfig[],
    movedWidgetId: string,
    newPosition: WidgetPosition
  ): WidgetConfig[] {
    const result = [...widgets];
    const movedWidget = result.find((w) => w.id === movedWidgetId);

    if (!movedWidget) return result;

    // First, validate the new position doesn't cause collisions
    const otherWidgets = result.filter((w) => w.id !== movedWidgetId);
    
    // If the requested position would cause collision, find a safe alternative
    if (this.hasCollision(newPosition, otherWidgets)) {
      // Find the closest safe position to the requested position
      const safePosition = this.findSafePositionNear(newPosition, otherWidgets);
      movedWidget.position = safePosition;
    } else {
    // Update the moved widget position
    movedWidget.position = { ...newPosition };
    }

    // Always perform collision resolution after any move
    return this.resolveAllCollisions(result, 5); // Increased iterations
  },

  /**
   * Find a safe position near the requested position
   */
  findSafePositionNear(
    requestedPosition: WidgetPosition,
    existingWidgets: WidgetConfig[]
  ): WidgetPosition {
    const { w, h } = requestedPosition;
    
    // Try positions in expanding search radius around requested position
    for (let radius = 0; radius <= 10; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const testPosition = {
            x: Math.max(0, Math.min(24 - w, requestedPosition.x + dx)),
            y: Math.max(0, requestedPosition.y + dy),
            w,
            h
          };
          
          if (!this.hasCollision(testPosition, existingWidgets)) {
            return testPosition;
          }
        }
      }
    }
    
    // Fallback: find any available position
    return this.findNextPosition(existingWidgets, 'medium', 24);
  },

  /**
   * Resolve all collisions in the layout
   */
  resolveAllCollisions(
    widgets: WidgetConfig[],
    maxIterations: number = 5  // Increased default
  ): WidgetConfig[] {
    const result = [...widgets];
    let iteration = 0;

    while (iteration < maxIterations) {
      let hasCollisions = false;
      const collisionPairs: Array<{a: WidgetConfig, b: WidgetConfig}> = [];

      // Collect all collision pairs first
      for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          const widgetA = result[i];
          const widgetB = result[j];

          if (this.hasCollision(widgetA.position, [widgetB])) {
            hasCollisions = true;
            collisionPairs.push({a: widgetA, b: widgetB});
          }
        }
      }

      if (!hasCollisions) break;

      // Resolve collisions in order of severity (larger overlaps first)
      for (const pair of collisionPairs) {
        const {a: widgetA, b: widgetB} = pair;
        
        // Still colliding after potential moves by previous pairs?
        if (this.hasCollision(widgetA.position, [widgetB])) {
            // Move the widget that's lower (higher Y) or rightmost if same Y
            const toMove =
              widgetA.position.y > widgetB.position.y ||
              (widgetA.position.y === widgetB.position.y &&
                widgetA.position.x > widgetB.position.x)
                ? widgetA
                : widgetB;

            // Find new position for the widget to move
            const newPos = this.findNextPosition(
              result.filter((w) => w.id !== toMove.id),
            toMove.size,
            24  // Ensure we use 24 columns
            );
            toMove.position = newPos;
        }
      }

      iteration++;
    }

    return result;
  },
};

/**
 * Dashboard Layout Hook
 * SRP: Handles only dashboard layout state and operations
 */
export const useDashboardLayout = (defaultLayoutId?: string) => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [layout, setLayout] = useState<DashboardLayout | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();

  // Load dashboard layout
  const {
    data: layoutData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-layout", defaultLayoutId || "default"],
    queryFn: () =>
      defaultLayoutId
        ? dashboardLayoutService.getLayout(defaultLayoutId)
        : dashboardLayoutService.getDefaultLayout(),
    staleTime: 5 * 60 * 1000, // 5 minutes (reduced from 15)
    gcTime: 15 * 60 * 1000, // 15 minutes cache time (reduced from 30)
    refetchOnMount: "always", // Always refetch on mount to get latest
    refetchOnWindowFocus: false, // Don't refetch on window focus
    enabled: typeof window !== "undefined", // Only fetch client-side
  });

  // Save layout mutation
  const saveLayoutMutation = useMutation({
    mutationFn: async (layout: DashboardLayout) => {
      console.warn("💾 SAVE DEBUG: layout.id =", layout.id);
      console.warn("💾 SAVE DEBUG: isValidMongoId =", layout.id && layout.id !== "default" && layout.id.match(/^[0-9a-fA-F]{24}$/));
      
      // If we have a real layout with a MongoDB _id, update it
      if (layout.id && layout.id !== "default" && layout.id.match(/^[0-9a-fA-F]{24}$/)) {
        console.warn("💾 SAVE DEBUG: Taking updateLayout path");
        return dashboardLayoutService.updateLayout(layout.id, layout);
      } else {
        console.warn("💾 SAVE DEBUG: Taking create/find path");
        // Try to find existing default layout first to avoid duplicates
        try {
          const existingLayout = await dashboardLayoutService.getDefaultLayout();
          console.warn("💾 SAVE DEBUG: existingLayout =", existingLayout);
          
          // Check if existingLayout exists first, then get id
          if (existingLayout) {
            const existingId = existingLayout.id || (existingLayout as DashboardLayoutWithMongoId)._id;
            if (existingId && existingId !== "default") {
            console.warn("💾 SAVE DEBUG: Found existing, will update:", existingId);
            // Update the existing default layout
            const updatedLayout = {
              ...existingLayout,
              widgets: layout.widgets,
              layoutSettings: layout.layoutSettings,
              updatedAt: new Date(),
            };
            return dashboardLayoutService.updateLayout(existingId, updatedLayout);
            }
          }
        } catch (error) {
          console.warn("💾 SAVE DEBUG: getDefaultLayout failed:", error);
        }

        console.warn("💾 SAVE DEBUG: Will create new layout");
        // Create new default layout with unique name
        const uniqueName = `Dashboard Personalizzata ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;
        
        const layoutToCreate = {
          ...layout,
          isDefault: true,
          name: uniqueName,
        };
        // Remove the "default" id as it's not a real MongoDB id
        const { id: _id, ...layoutData } = layoutToCreate;
        return dashboardLayoutService.createLayout(layoutData);
      }
    },
    onSuccess: (savedLayout) => {
      console.warn("💾 SAVE SUCCESS: savedLayout =", savedLayout);
      
      // CRITICAL: Ensure layout keeps the correct ID from saved layout
      const layoutId = savedLayout.id || (savedLayout as DashboardLayoutWithMongoId)._id;
      if (!layoutId) {
        console.error("💾 SAVE ERROR: No valid ID found in savedLayout", savedLayout);
        return;
      }
      
      const normalizedLayout: DashboardLayout = {
        ...savedLayout,
        id: layoutId // Ensured to be string
      };
      
      setLayout(normalizedLayout);
      
      // CRITICAL: Sync widgets state with saved layout for immediate display
      if (savedLayout.widgets) {
        setWidgets(savedLayout.widgets);
      }
      
      // Set justSaved flag to prevent useEffect from overriding for a short period
      setJustSaved(true);
      
      // Reset hasChanges AFTER syncing widgets
      setHasChanges(false);
      
      // Clear the justSaved flag after a short delay to allow cache updates to settle
      setTimeout(() => {
        setJustSaved(false);
      }, 1000); // 1 second protection window
      
      showSuccess(
        "Layout Salvato",
        "La configurazione della dashboard è stata salvata"
      );
      
      // Update all possible cache keys for the saved layout
      const cacheKeys = [
        ["dashboard-layout", "default"],
        ["dashboard-layout", defaultLayoutId || "default"],
        ["dashboard-layout", savedLayout.id],
      ];
      
      cacheKeys.forEach(key => {
        queryClient.setQueryData(key, savedLayout);
      });
      
      // Invalidate queries for next navigation, but don't force immediate refetch
      // to prevent race conditions with our current state
      queryClient.invalidateQueries({ 
        queryKey: ["dashboard-layout"],
        exact: false
      });
    },
    onError: (error) => {
      showError(
        "Errore Salvataggio",
        "Impossibile salvare la configurazione della dashboard"
      );
      console.error("Layout save error:", error);
    },
  });

  // Initialize widgets from layout data
  // Sync layout data with local state, but avoid overriding fresh changes or recent saves
  useEffect(() => {
    if (layoutData) {
      setLayout(layoutData);
      
      // Only update widgets if we don't have pending changes AND we didn't just save
      // This prevents the useEffect from overriding fresh widget additions or fresh saves
      if (!hasChanges && !justSaved) {
        setWidgets(layoutData.widgets);
        setHasChanges(false);
      }
    }
  }, [layoutData, hasChanges, justSaved]);

  // Widget management functions
  const addWidget = useCallback(
    (
      widgetType: string,
      selectedSize?: string,
      customPosition?: Partial<WidgetPosition>
    ) => {
      const registryEntry = WidgetRegistry.getById(widgetType);
      if (!registryEntry) {
        showError(
          "Widget non trovato",
          `Il widget ${widgetType} non è disponibile`
        );
        return;
      }

      // Use selected size if provided and supported, otherwise use default
      const widgetSize =
        selectedSize &&
        registryEntry.supportedSizes.includes(selectedSize as WidgetSize)
          ? (selectedSize as WidgetConfig["size"])
          : registryEntry.defaultSize;

      // Find safe position for the new widget (no overlaps)
      const position = customPosition
        ? positionUtils.findSafePositionNear(
            {
            ...positionUtils.findNextPosition(widgets, widgetSize),
            ...customPosition,
            } as WidgetPosition,
            widgets
          )
        : positionUtils.findNextPosition(widgets, widgetSize);

      const newWidget: WidgetConfig = {
        id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: registryEntry.type as WidgetType, // Use registry type, not widget ID
        title: registryEntry.name,
        size: widgetSize,
        position,
        isVisible: true,
        refreshInterval: registryEntry.defaultConfig.refreshInterval || 300,
        customSettings: {
          ...(registryEntry.defaultConfig.customSettings || {}),
          widgetRegistryId: widgetType, // Store the actual widget ID for component rendering
        },
      };

      // Add the widget and resolve any remaining collisions
      const newWidgets = [...widgets, newWidget];
      const safeWidgets = positionUtils.resolveAllCollisions(newWidgets, 5);
      setWidgets(safeWidgets);
      setHasChanges(true);
      showSuccess(
        "Widget Aggiunto",
        `${registryEntry.name} è stato aggiunto alla dashboard`
      );
    },
    [widgets, showSuccess, showError]
  );

  const removeWidget = useCallback(
    (widgetId: string) => {
      const widget = widgets.find((w) => w.id === widgetId);
      setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
      setHasChanges(true);

      if (widget) {
        showSuccess(
          "Widget Rimosso",
          `${widget.title} è stato rimosso dalla dashboard`
        );
      }
    },
    [widgets, showSuccess]
  );

  const updateWidget = useCallback(
    (widgetId: string, updates: Partial<WidgetConfig>) => {
      setWidgets((prev) =>
        prev.map((widget) =>
          widget.id === widgetId ? { ...widget, ...updates } : widget
        )
      );
      setHasChanges(true);
    },
    []
  );

  const moveWidget = useCallback(
    (widgetId: string, position: WidgetPosition) => {
      // Use reorganization logic to avoid overlaps
      const reorganizedWidgets = positionUtils.reorganizeWidgets(
        widgets,
        widgetId,
        position
      );
      setWidgets(reorganizedWidgets);
      setHasChanges(true);
    },
    [widgets]
  );

  // Layout management functions
  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  const saveLayout = useCallback(async () => {
    if (!hasChanges) {
      return;
    }

    // Create layout object to save
    const layoutToSave: DashboardLayout = layout
      ? {
          ...layout,
          widgets,
          updatedAt: new Date(),
        }
      : {
          // Create new default layout if no existing layout
          id: "default",
          userId: "current-user", // Will be set by API
          name: "Dashboard Personalizzata",
          isDefault: true,
          widgets,
          layoutSettings: {
          columns: 24,  // Increased for finer positioning
          rowHeight: 80,  // Smaller rows for more precision
          margin: [8, 8],  // Smaller margins between widgets
            containerPadding: [16, 16],
            breakpoints: {
              lg: 1200,
              md: 996,
              sm: 768,
              xs: 480,
            },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

    await saveLayoutMutation.mutateAsync(layoutToSave);
  }, [layout, widgets, hasChanges, saveLayoutMutation]);

  const resetLayout = useCallback(() => {
    if (layoutData) {
      setWidgets(layoutData.widgets);
      setHasChanges(false);
      showSuccess(
        "Layout Ripristinato",
        "La dashboard è stata ripristinata alla configurazione salvata"
      );
    }
  }, [layoutData, showSuccess]);

  // Widget refresh functions
  const refreshWidget = useCallback(
    (widgetId: string) => {
      // Trigger refresh for specific widget
      queryClient.invalidateQueries({
        queryKey: ["widget-data", widgetId],
      });
    },
    [queryClient]
  );

  const refreshAll = useCallback(() => {
    // Trigger refresh for all widgets
    widgets.forEach((widget) => {
      queryClient.invalidateQueries({
        queryKey: ["widget-data", widget.id],
      });
    });
    showSuccess("Dati Aggiornati", "Tutti i widget sono stati aggiornati");
  }, [widgets, queryClient, showSuccess]);

  return {
    widgets,
    layout,
    isEditing,
    hasChanges,
    isLoading: isLoading || saveLayoutMutation.isPending,
    error: error?.message || null,

    // Widget operations
    addWidget,
    removeWidget,
    updateWidget,
    moveWidget,

    // Layout operations
    toggleEditing,
    saveLayout,
    resetLayout,

    // Data operations
    refreshWidget,
    refreshAll,
  };
};
