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
} from "@/components/widgets/base/types";
import { WidgetRegistry } from "@/components/widgets/registry/WidgetRegistry";
import { useNotifications } from "@/providers/NotificationProvider";
import { dashboardLayoutService } from "@/services/dashboardLayoutService";

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
const _createDefaultLayout = (): DashboardLayout => {
  const defaultWidgets = WidgetRegistry.getDefaultLayout()
    .map((item) => {
      const registryEntry = WidgetRegistry.getById(item.widgetId);
      if (!registryEntry) return null;

      return {
        id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: registryEntry.type, // Use registry type, not widget ID
        title: registryEntry.name,
        size: registryEntry.defaultSize,
        position: item.position,
        isVisible: true,
        refreshInterval: 300,
        customSettings: {
          ...registryEntry.defaultConfig.customSettings || {},
          widgetRegistryId: item.widgetId, // Store the actual widget ID for component rendering
        },
      } as WidgetConfig;
    })
    .filter(Boolean) as WidgetConfig[];

  return {
    id: "default",
    userId: "current-user",
    name: "Layout Predefinito",
    isDefault: true,
    widgets: defaultWidgets,
    layoutSettings: {
      columns: 12,
      rowHeight: 150,
      margin: [16, 16],
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
};

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
    columns: number = 12
  ): WidgetPosition {
    const sizeMap = {
      small: { w: 3, h: 1 },
      medium: { w: 6, h: 1 },
      large: { w: 6, h: 2 },
      full: { w: 12, h: 2 },
    };

    const { w, h } = sizeMap[widgetSize];

    // Try to find a position with minimal Y (prefer higher positions)
    // and minimal X (prefer left positions)
    let bestPosition: WidgetPosition | null = null;
    let bestScore = Infinity;

    for (let y = 0; y < 20; y++) {
      for (let x = 0; x <= columns - w; x++) {
        const position = { x, y, w, h };
        if (!this.hasCollision(position, existingWidgets)) {
          // Score: prioritize higher positions (lower Y) and left positions (lower X)
          const score = y * 100 + x; // Y is much more important than X
          if (score < bestScore) {
            bestScore = score;
            bestPosition = position;
          }
        }
      }
    }

    // If we found a good position, return it
    if (bestPosition) {
      return bestPosition;
    }

    // Fallback: place at bottom
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
  reorganizeWidgets(widgets: WidgetConfig[], movedWidgetId: string, newPosition: WidgetPosition): WidgetConfig[] {
    const result = [...widgets];
    const movedWidget = result.find(w => w.id === movedWidgetId);
    
    if (!movedWidget) return result;
    
    // Update the moved widget position
    movedWidget.position = { ...newPosition };
    
    // Find widgets that collide with the moved widget
    const collidingWidgets = result.filter(w => 
      w.id !== movedWidgetId && this.hasCollision(newPosition, [w])
    );
    
    // For each colliding widget, find a new position
    for (const collidingWidget of collidingWidgets) {
      const newPos = this.findNextPosition(
        result.filter(w => w.id !== collidingWidget.id), // Exclude the widget we're moving
        collidingWidget.size
      );
      collidingWidget.position = newPos;
    }
    
    // After moving colliding widgets, check for any new collisions created
    // and resolve them recursively (but limit recursion to prevent infinite loops)
    return this.resolveAllCollisions(result, 3);
  },

  /**
   * Resolve all collisions in the layout
   */
  resolveAllCollisions(widgets: WidgetConfig[], maxIterations: number = 3): WidgetConfig[] {
    let result = [...widgets];
    let iteration = 0;
    
    while (iteration < maxIterations) {
      let hasCollisions = false;
      
      // Find all collision pairs
      for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          const widgetA = result[i];
          const widgetB = result[j];
          
          if (this.hasCollision(widgetA.position, [widgetB])) {
            hasCollisions = true;
            
            // Move the widget that's lower (higher Y) or rightmost if same Y
            const toMove = widgetA.position.y > widgetB.position.y || 
                          (widgetA.position.y === widgetB.position.y && widgetA.position.x > widgetB.position.x) 
                          ? widgetA : widgetB;
            
            // Find new position for the widget to move
            const newPos = this.findNextPosition(
              result.filter(w => w.id !== toMove.id),
              toMove.size
            );
            toMove.position = newPos;
          }
        }
      }
      
      if (!hasCollisions) break;
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

  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();

  // Load dashboard layout
  const {
    data: layoutData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-layout", defaultLayoutId],
    queryFn: () =>
      defaultLayoutId
        ? dashboardLayoutService.getLayout(defaultLayoutId)
        : dashboardLayoutService.getDefaultLayout(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Save layout mutation
  const saveLayoutMutation = useMutation({
    mutationFn: (layout: DashboardLayout) => {
      console.log("🔄 Saving layout:", { id: layout.id, widgetCount: layout.widgets.length });
      
      // If we have a real MongoDB _id (not "default"), update existing layout
      if (layout.id && layout.id !== "default" && layout.id.length === 24) {
        console.log("📝 Updating existing layout with ID:", layout.id);
        return dashboardLayoutService.updateLayout(layout.id, layout);
      } else {
        // Create new default layout (will be marked as default)
        const layoutToCreate = {
          ...layout,
          isDefault: true, // Ensure it's marked as default
          name: layout.name || "Dashboard Personalizzata"
        };
        // Remove the "default" id as it's not a real MongoDB id
        const { id, ...layoutData } = layoutToCreate;
        console.log("✨ Creating new default layout:", { widgetCount: layoutData.widgets.length });
        return dashboardLayoutService.createLayout(layoutData);
      }
    },
    onSuccess: (savedLayout) => {
      setLayout(savedLayout);
      setHasChanges(false);
      showSuccess(
        "Layout Salvato",
        "La configurazione della dashboard è stata salvata"
      );
      queryClient.invalidateQueries({ queryKey: ["dashboard-layout"] });
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
  useEffect(() => {
    if (layoutData) {
      setLayout(layoutData);
      setWidgets(layoutData.widgets);
      setHasChanges(false);
    }
  }, [layoutData]);

  // Widget management functions
  const addWidget = useCallback(
    (widgetType: string, selectedSize?: string, customPosition?: Partial<WidgetPosition>) => {
      const registryEntry = WidgetRegistry.getById(widgetType);
      if (!registryEntry) {
        showError(
          "Widget non trovato",
          `Il widget ${widgetType} non è disponibile`
        );
        return;
      }

      // Use selected size if provided and supported, otherwise use default
      const widgetSize = selectedSize && registryEntry.supportedSizes.includes(selectedSize as any) 
        ? selectedSize as WidgetConfig["size"]
        : registryEntry.defaultSize;

      const position = customPosition
        ? {
            ...positionUtils.findNextPosition(
              widgets,
              widgetSize
            ),
            ...customPosition,
          }
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
          ...registryEntry.defaultConfig.customSettings || {},
          widgetRegistryId: widgetType, // Store the actual widget ID for component rendering
        },
      };

      setWidgets((prev) => [...prev, newWidget]);
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
      console.log('🔄 Moving widget:', widgetId, 'to position:', position);
      
      // Use reorganization logic to avoid overlaps
      const reorganizedWidgets = positionUtils.reorganizeWidgets(widgets, widgetId, position);
      
      console.log('📊 Reorganized widgets:', reorganizedWidgets.map(w => ({
        id: w.id,
        title: w.title,
        position: w.position
      })));
      
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
      console.log("⚠️ No changes to save");
      return;
    }

    console.log("💾 saveLayout called:", { hasLayout: !!layout, widgetCount: widgets.length });

    // Create layout object to save
    const layoutToSave: DashboardLayout = layout ? {
      ...layout,
      widgets,
      updatedAt: new Date(),
    } : {
      // Create new default layout if no existing layout
      id: "default",
      userId: "current-user", // Will be set by API
      name: "Dashboard Personalizzata",
      isDefault: true,
      widgets,
      layoutSettings: {
        columns: 12,
        rowHeight: 150,
        margin: [16, 16],
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
