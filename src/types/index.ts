import { Document } from "mongoose";

// Base types
export interface BaseDocument extends Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface IUser extends BaseDocument {
  email: string;
  password: string;
  name: string;
  googleId?: string;
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
  lastLogin?: Date;
  createdBy?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// Auth types
export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

// User Settings types
export type TaxRegime = "forfettario" | "ordinario";
export type PensionSystem = "INPS" | "PROFESSIONAL_FUND";
export type InpsRateType =
  | "COLLABORATOR_WITH_DISCOLL"
  | "COLLABORATOR_WITHOUT_DISCOLL"
  | "PROFESSIONAL"
  | "PENSIONER";

export interface IUserSettings extends BaseDocument {
  userId: string;
  taxRegime: TaxRegime;
  substituteRate?: number;
  profitabilityRate?: number;
  pensionSystem: PensionSystem;
  professionalFundId?: string;
  inpsRateType?: InpsRateType;
  manualContributionRate?: number;
  manualMinimumContribution?: number;
  manualFixedAnnualContributions?: number;
}

// Invoice types
export type VatType =
  | "standard"
  | "reduced10"
  | "reduced5"
  | "reduced4"
  | "custom";

export interface VatInfo {
  vatType: VatType;
  vatRate: number;
}

export interface IInvoice extends BaseDocument {
  userId: string;
  number: string;
  issueDate: Date;
  title: string;
  clientName: string;
  amount: number;
  paymentDate?: Date;
  fiscalYear: number;
  vat?: VatInfo;
}

export * from "./Invoice";

/**
 * Cost Management Types
 */
export interface ICost {
  _id?: string;
  userId: string;
  description: string;
  date: Date;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CostCreateRequest {
  description: string;
  date: string | Date;
  amount: number;
}

export interface CostUpdateRequest {
  description?: string;
  date?: string | Date;
  amount?: number;
}

export interface CostResponse {
  id: string;
  description: string;
  date: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Professional Fund Management Types
 */
export interface IProfessionalFund {
  _id?: string;
  name: string;
  code: string;
  description?: string;
  parameters: {
    contributionRate: number; // Percentage (e.g., 16 for 16%)
    minimumContribution: number; // In euros (e.g., 2750)
    fixedAnnualContributions: number; // Fixed annual contributions in euros
    year: number; // The year these parameters are valid for
  }[];
  allowManualEdit: boolean; // Whether to allow manual editing of contribution parameters
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfessionalFundCreateRequest {
  name: string;
  code: string;
  description?: string;
  parameters: {
    contributionRate: number;
    minimumContribution: number;
    fixedAnnualContributions: number;
    year: number;
  }[];
  allowManualEdit?: boolean;
  isActive?: boolean;
}

export interface ProfessionalFundUpdateRequest {
  name?: string;
  code?: string;
  description?: string;
  parameters?: {
    contributionRate: number;
    minimumContribution: number;
    fixedAnnualContributions: number;
    year: number;
  }[];
  allowManualEdit?: boolean;
  isActive?: boolean;
}

export interface ProfessionalFundResponse {
  id: string;
  name: string;
  code: string;
  description?: string;
  parameters: {
    contributionRate: number;
    minimumContribution: number;
    fixedAnnualContributions: number;
    year: number;
  }[];
  allowManualEdit: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// IRPEF Rate types
export interface IIrpefRate extends BaseDocument {
  rate: number;
  lowerBound: number;
  upperBound?: number;
  year: number;
  isActive: boolean;
}

// INPS types
export interface InpsRate {
  type: string;
  description: string;
  rate: number;
}

export interface IInpsParameters extends BaseDocument {
  year: number;
  rates: InpsRate[];
  maxIncome: number;
  minIncome: number;
  minContributions: Record<string, number>;
}

// Previous Year Contribution types
export interface IPreviousYearContribution extends BaseDocument {
  userId: string;
  year: number;
  amount: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Test types for better type safety
export interface TestUser {
  _id: string;
  email: string;
  password?: string;
  name: string;
  googleId?: string;
}

export interface TestCost {
  _id: string;
  userId: string;
  description: string;
  date: Date;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
  save?: () => Promise<TestCost>;
}

export interface TestRequestBody {
  [key: string]: unknown;
}

export interface MockRequestOptions {
  method?: string;
  body?: TestRequestBody;
  headers?: Record<string, string>;
}

// MongoDB query types
export interface UserQuery {
  email?: string;
  googleId?: string;
  _id?: { $ne: string };
}

export interface ProfessionalFundQuery {
  code?: string | { $regex: RegExp; $options: string };
  isActive?: boolean;
  _id?: { $ne: string };
}

export interface CostQuery {
  userId: string;
  date?: { $gte?: Date; $lte?: Date };
}

// Database document types (raw MongoDB objects)
export interface RawMongoDocument {
  _id: unknown;
  toJSON?: () => Record<string, unknown>;
  toString?: () => string;
  [key: string]: unknown;
}

export interface RawCost extends RawMongoDocument {
  description: string;
  date: Date;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawProfessionalFund extends RawMongoDocument {
  name: string;
  code: string;
  description: string;
  parameters: Array<{
    contributionRate: number;
    minimumContribution: number;
    fixedAnnualContributions: number;
    year: number;
  }>;
  allowManualEdit: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RawUserSettings extends RawMongoDocument {
  userId: string;
  taxRegime: TaxRegime;
  substituteRate?: number;
  profitabilityRate?: number;
  pensionSystem: PensionSystem;
  professionalFundId?: string;
  inpsRateType?: InpsRateType;
  manualContributionRate?: number;
  manualMinimumContribution?: number;
  manualFixedAnnualContributions?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Professional fund parameter validation type
export interface ProfessionalFundParameter {
  contributionRate: number;
  minimumContribution: number;
  fixedAnnualContributions: number;
  year: number;
}

// Tax calculation types
export * from "./tax";

// Navigation types
export * from "./navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  type: "invoice" | "cost" | "settings";
  description: string;
  amount?: number;
  date: Date;
}

// Notification system types
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // Auto-dismiss duration in ms (0 = no auto-dismiss)
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: Date;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  // Convenience methods
  showSuccess: (title: string, message: string, duration?: number) => string;
  showError: (title: string, message: string, duration?: number) => string;
  showWarning: (title: string, message: string, duration?: number) => string;
  showInfo: (title: string, message: string, duration?: number) => string;
}

// Donation Types
export interface DonationRequest {
  amount: number; // In cents
  donorEmail?: string;
  donorName?: string;
  isAnonymous: boolean;
  message?: string;
  consentToContact: boolean;
  source: 'web' | 'mobile';
}

export interface DonationResponse {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  donorName?: string;
  isAnonymous: boolean;
  donationType: 'one-time' | 'monthly';
  message?: string;
  paymentMethod: string;
  createdAt: string;
  processedAt?: string;
}

export interface StripePaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface DonationStats {
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
  lastDonation: string | null;
  monthlyGoal: number;
  monthlyProgress: number;
}
