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
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
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

// Cost types
export interface ICost extends BaseDocument {
  userId: string;
  description: string;
  date: Date;
  amount: number;
  deductible: boolean;
}

// Professional Fund types
export interface ProfessionalFundParameters {
  contributionRate: number;
  minimumContribution: number;
  fixedAnnualContributions: number;
  year: number;
}

export interface IProfessionalFund extends BaseDocument {
  name: string;
  code: string;
  description?: string;
  parameters: ProfessionalFundParameters[];
  allowManualEdit: boolean;
  isActive: boolean;
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
export interface ApiResponse<T = any> {
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
  details?: any;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
