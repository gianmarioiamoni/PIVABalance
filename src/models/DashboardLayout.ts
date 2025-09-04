/**
 * Dashboard Layout Model
 *
 * SRP: Handles ONLY dashboard layout data persistence
 * MongoDB schema for storing user dashboard configurations
 */

import { Schema, model, models } from "mongoose";
import {
  DashboardLayout as IDashboardLayout,
  WidgetConfig,
  WidgetPosition,
} from "@/components/widgets/base/types";

/**
 * Widget Position Schema
 * SRP: Handles only widget position data structure
 */
const widgetPositionSchema = new Schema<WidgetPosition>(
  {
    x: {
      type: Number,
      required: [true, "Widget X position is required"],
      min: [0, "X position cannot be negative"],
    },
    y: {
      type: Number,
      required: [true, "Widget Y position is required"],
      min: [0, "Y position cannot be negative"],
    },
    w: {
      type: Number,
      required: [true, "Widget width is required"],
      min: [1, "Widget width must be at least 1"],
    },
    h: {
      type: Number,
      required: [true, "Widget height is required"],
      min: [1, "Widget height must be at least 1"],
    },
  },
  { _id: false }
);

/**
 * Widget Configuration Schema
 * SRP: Handles only widget configuration data structure
 */
const widgetConfigSchema = new Schema<WidgetConfig>(
  {
    id: {
      type: String,
      required: [true, "Widget ID is required"],
    },
    type: {
      type: String,
      required: [true, "Widget type is required"],
      enum: {
        values: ["financial", "analytics", "productivity", "chart"],
        message:
          "Widget type must be one of: financial, analytics, productivity, chart",
      },
    },
    title: {
      type: String,
      required: [true, "Widget title is required"],
      trim: true,
      maxlength: [100, "Widget title cannot exceed 100 characters"],
    },
    size: {
      type: String,
      required: [true, "Widget size is required"],
      enum: {
        values: ["small", "medium", "large", "full"],
        message: "Widget size must be one of: small, medium, large, full",
      },
    },
    position: {
      type: widgetPositionSchema,
      required: [true, "Widget position is required"],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    refreshInterval: {
      type: Number,
      min: [30, "Refresh interval must be at least 30 seconds"],
      max: [3600, "Refresh interval cannot exceed 1 hour"],
      default: 300,
    },
    customSettings: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

/**
 * Layout Settings Schema
 * SRP: Handles only layout configuration data structure
 */
const layoutSettingsSchema = new Schema(
  {
    columns: {
      type: Number,
      required: [true, "Layout columns is required"],
      min: [1, "Layout must have at least 1 column"],
      max: [24, "Layout cannot have more than 24 columns"],
      default: 12,
    },
    rowHeight: {
      type: Number,
      required: [true, "Row height is required"],
      min: [50, "Row height must be at least 50px"],
      max: [500, "Row height cannot exceed 500px"],
      default: 150,
    },
    margin: {
      type: [Number],
      validate: {
        validator: (v: number[]) => v.length === 2,
        message: "Margin must be an array of 2 numbers [horizontal, vertical]",
      },
      default: [16, 16],
    },
    containerPadding: {
      type: [Number],
      validate: {
        validator: (v: number[]) => v.length === 2,
        message:
          "Container padding must be an array of 2 numbers [horizontal, vertical]",
      },
      default: [16, 16],
    },
    breakpoints: {
      type: Map,
      of: Number,
      default: new Map([
        ["lg", 1200],
        ["md", 996],
        ["sm", 768],
        ["xs", 480],
      ]),
    },
  },
  { _id: false }
);

/**
 * Dashboard Layout Schema
 * SRP: Handles only dashboard layout data persistence
 */
const dashboardLayoutSchema = new Schema<IDashboardLayout>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
      index: true,
    },
    name: {
      type: String,
      required: [true, "Layout name is required"],
      trim: true,
      maxlength: [100, "Layout name cannot exceed 100 characters"],
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    widgets: {
      type: [widgetConfigSchema],
      validate: {
        validator: (widgets: WidgetConfig[]) => widgets.length <= 20,
        message: "Cannot have more than 20 widgets per layout",
      },
      default: [],
    },
    layoutSettings: {
      type: layoutSettingsSchema,
      required: [true, "Layout settings are required"],
    },
  },
  {
    timestamps: true,
    collection: "dashboard_layouts",
  }
);

/**
 * Indexes for Performance
 * SRP: Handles only database optimization
 */
dashboardLayoutSchema.index({ userId: 1, isDefault: 1 });
dashboardLayoutSchema.index({ userId: 1, name: 1 }, { unique: true });
dashboardLayoutSchema.index({ updatedAt: -1 });

/**
 * Pre-save Middleware
 * SRP: Handles only data validation before save
 */
dashboardLayoutSchema.pre("save", function (next) {
  // Ensure only one default layout per user
  if (this.isDefault && this.isModified("isDefault")) {
    // In a real implementation, you'd update other layouts to set isDefault: false
    // For now, we'll handle this in the application logic
  }

  // Validate widget positions don't overlap
  const widgets = this.widgets;
  for (let i = 0; i < widgets.length; i++) {
    for (let j = i + 1; j < widgets.length; j++) {
      const w1 = widgets[i].position;
      const w2 = widgets[j].position;

      const overlap = !(
        w1.x >= w2.x + w2.w ||
        w1.x + w1.w <= w2.x ||
        w1.y >= w2.y + w2.h ||
        w1.y + w1.h <= w2.y
      );

      if (overlap) {
        return next(
          new Error(
            `Widget positions overlap: ${widgets[i].title} and ${widgets[j].title}`
          )
        );
      }
    }
  }

  next();
});

/**
 * Export Dashboard Layout Model
 * SRP: Handles only model export
 */
export const DashboardLayout =
  models.DashboardLayout ||
  model<IDashboardLayout>("DashboardLayout", dashboardLayoutSchema);

export default DashboardLayout;
