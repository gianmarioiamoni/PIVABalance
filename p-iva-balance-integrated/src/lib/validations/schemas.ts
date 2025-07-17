import { z } from "zod";

/**
 * Validation Schemas using Zod
 * Follows Single Responsibility Principle - each schema validates one entity
 * Follows Open/Closed Principle - easily extensible for new validation rules
 */

// Base schemas
export const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .max(255, "Email too long");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one lowercase, uppercase, and number"
  );

// Auth schemas
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Name can only contain letters, spaces, apostrophes, and hyphens"
    ),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// User Settings schemas
export const taxRegimeSchema = z.enum(["forfettario", "ordinario"]);
export const pensionSystemSchema = z.enum(["INPS", "PROFESSIONAL_FUND"]);
export const inpsRateTypeSchema = z.enum([
  "COLLABORATOR_WITH_DISCOLL",
  "COLLABORATOR_WITHOUT_DISCOLL",
  "PROFESSIONAL",
  "PENSIONER",
]);

export const userSettingsSchema = z
  .object({
    taxRegime: taxRegimeSchema,
    substituteRate: z.number().min(0).max(100).optional(),
    profitabilityRate: z.number().min(0).max(100).optional(),
    pensionSystem: pensionSystemSchema,
    professionalFundId: z.string().optional(),
    inpsRateType: inpsRateTypeSchema.optional(),
    manualContributionRate: z.number().min(0).max(100).optional(),
    manualMinimumContribution: z.number().min(0).optional(),
    manualFixedAnnualContributions: z.number().min(0).optional(),
  })
  .refine(
    (data) => {
      // Validate pension system specific fields
      if (data.pensionSystem === "INPS") {
        return !!data.inpsRateType;
      }
      if (data.pensionSystem === "PROFESSIONAL_FUND") {
        return !!data.professionalFundId;
      }
      return true;
    },
    {
      message: "Invalid pension system configuration",
      path: ["pensionSystem"],
    }
  )
  .refine(
    (data) => {
      // Validate tax regime specific fields for forfettario
      if (data.taxRegime === "forfettario") {
        return (
          data.substituteRate !== undefined &&
          data.profitabilityRate !== undefined
        );
      }
      return true;
    },
    {
      message:
        "Substitute rate and profitability rate are required for forfettario regime",
      path: ["taxRegime"],
    }
  );

// Invoice schemas
export const vatSchema = z
  .object({
    vatType: z.enum([
      "standard",
      "reduced10",
      "reduced5",
      "reduced4",
      "custom",
    ]),
    vatRate: z.number().min(0).max(100),
  })
  .refine(
    (data) => {
      // Validate VAT rate matches type
      const validRates = {
        standard: 22,
        reduced10: 10,
        reduced5: 5,
        reduced4: 4,
      };

      if (data.vatType !== "custom" && data.vatType in validRates) {
        return (
          data.vatRate === validRates[data.vatType as keyof typeof validRates]
        );
      }
      return true;
    },
    {
      message: "VAT rate does not match the selected VAT type",
    }
  );

export const invoiceSchema = z.object({
  number: z
    .string()
    .min(1, "Invoice number is required")
    .max(50, "Invoice number cannot exceed 50 characters")
    .regex(
      /^[A-Za-z0-9\-\/]+$/,
      "Invoice number can only contain letters, numbers, hyphens, and slashes"
    ),
  issueDate: z.string().datetime("Invalid date format").or(z.date()),
  title: z
    .string()
    .min(1, "Invoice title is required")
    .max(500, "Invoice title cannot exceed 500 characters"),
  clientName: z
    .string()
    .min(1, "Client name is required")
    .max(200, "Client name cannot exceed 200 characters"),
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(999999999.99, "Amount is too large"),
  paymentDate: z.string().datetime().or(z.date()).optional(),
  fiscalYear: z
    .number()
    .int("Fiscal year must be an integer")
    .min(2000, "Fiscal year must be 2000 or later")
    .max(2100, "Fiscal year must be 2100 or earlier"),
  vat: vatSchema.optional(),
});

export const updateInvoiceSchema = invoiceSchema.partial().extend({
  paymentDate: z.string().datetime().or(z.date()).or(z.null()).optional(),
});

// Cost schemas
export const costSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  date: z.string().datetime("Invalid date format").or(z.date()),
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(999999999.99, "Amount is too large"),
  deductible: z.boolean().default(true),
});

export const updateCostSchema = costSchema.partial();

// Query parameter schemas
export const yearQuerySchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number")
    .transform(Number),
});

export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Professional Fund schemas
export const professionalFundParametersSchema = z.object({
  contributionRate: z.number().min(0).max(100),
  minimumContribution: z.number().min(0),
  fixedAnnualContributions: z.number().min(0).default(0),
  year: z.number().int().min(2000).max(2100),
});

export const professionalFundSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  code: z.string().min(1, "Code is required").max(20, "Code too long"),
  description: z.string().max(500, "Description too long").optional(),
  parameters: z
    .array(professionalFundParametersSchema)
    .min(1, "At least one parameter set is required"),
  allowManualEdit: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

/**
 * User Settings validation schemas
 */
export const userSettingsValidationSchema = z
  .object({
    userId: mongoIdSchema,
    taxRegime: z.enum(["forfettario", "ordinario"]),
    substituteRate: z.number().min(0).max(100).optional(),
    profitabilityRate: z.number().min(0).max(100).optional(),
    pensionSystem: z.enum(["INPS", "PROFESSIONAL_FUND"]),
    professionalFundId: z.string().optional(),
    inpsRateType: z
      .enum([
        "COLLABORATOR_WITH_DISCOLL",
        "COLLABORATOR_WITHOUT_DISCOLL",
        "PROFESSIONAL",
        "PENSIONER",
      ])
      .optional(),
    manualContributionRate: z.number().min(0).max(100).optional(),
    manualMinimumContribution: z.number().min(0).optional(),
    manualFixedAnnualContributions: z.number().min(0).optional(),
  })
  .refine(
    (data) => {
      // If tax regime is forfettario, profitabilityRate and substituteRate are required
      if (data.taxRegime === "forfettario") {
        return (
          data.profitabilityRate !== undefined &&
          data.substituteRate !== undefined
        );
      }
      return true;
    },
    {
      message:
        "Per il regime forfettario sono richiesti coefficiente di redditività e imposta sostitutiva",
      path: ["profitabilityRate"],
    }
  )
  .refine(
    (data) => {
      // If pension system is PROFESSIONAL_FUND, professionalFundId is required
      if (data.pensionSystem === "PROFESSIONAL_FUND") {
        return data.professionalFundId !== undefined;
      }
      return true;
    },
    {
      message: "Per le casse professionali è richiesto l'ID del fondo",
      path: ["professionalFundId"],
    }
  );

export const userSettingsCreateSchema = userSettingsValidationSchema.omit({
  userId: true,
});
export const userSettingsUpdateSchema = userSettingsCreateSchema.partial();

// API Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  errors: z.array(z.string()).optional(),
});

/**
 * Validation helper functions
 */

/**
 * Create a validation error object (functional approach)
 * Follows functional programming principles - pure function that creates error objects
 */
export const createValidationError = (
  errors: z.ZodError,
  message = "Validation failed"
): Error & { errors: z.ZodError } => {
  const error = new Error(message) as Error & { errors: z.ZodError };
  error.name = "ValidationError";
  error.errors = errors;
  return error;
};

/**
 * Check if an error is a validation error (functional approach)
 * Pure function - type guard for validation errors
 */
export const isValidationError = (
  error: unknown
): error is Error & { errors: z.ZodError } => {
  return (
    error instanceof Error &&
    error.name === "ValidationError" &&
    "errors" in error
  );
};

/**
 * Validate data against schema and throw detailed error if invalid
 * Functional approach - uses pure function composition
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw createValidationError(result.error);
  }

  return result.data;
}

/**
 * Validate data against schema and return result with errors
 */
export function validateSchemaWithResult<T>(
  schema: z.ZodSchema<T>,
  data: unknown
) {
  return schema.safeParse(data);
}

/**
 * Cost validation schemas
 * Follows validation rules consistent with Cost model
 */
export const costCreateSchema = z.object({
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(200, "Description cannot exceed 200 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s.,;:()\-_'"!?€$%&+/\\]+$/,
      "Description contains invalid characters"
    ),
  date: z
    .string()
    .or(z.date())
    .refine((val) => {
      const date = new Date(val);
      const minDate = new Date("2000-01-01");
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 1);
      return date >= minDate && date <= maxDate;
    }, "Date must be between 2000-01-01 and today"),
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(999999.99, "Amount cannot exceed 999,999.99")
    .refine(
      (val) => Number.isFinite(val) && /^\d+(\.\d{1,2})?$/.test(val.toString()),
      "Amount must have at most 2 decimal places"
    ),
});

export const costUpdateSchema = z.object({
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(200, "Description cannot exceed 200 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s.,;:()\-_'"!?€$%&+/\\]+$/,
      "Description contains invalid characters"
    )
    .optional(),
  date: z
    .string()
    .or(z.date())
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      const minDate = new Date("2000-01-01");
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 1);
      return date >= minDate && date <= maxDate;
    }, "Date must be between 2000-01-01 and today")
    .optional(),
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(999999.99, "Amount cannot exceed 999,999.99")
    .refine((val) => {
      if (val === undefined) return true;
      return Number.isFinite(val) && /^\d+(\.\d{1,2})?$/.test(val.toString());
    }, "Amount must have at most 2 decimal places")
    .optional(),
});

export const costQuerySchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number")
    .refine((val) => {
      const year = parseInt(val);
      return year >= 2000 && year <= new Date().getFullYear();
    }, "Year must be between 2000 and current year")
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive number")
    .refine((val) => parseInt(val) <= 1000, "Limit cannot exceed 1000")
    .optional(),
  offset: z
    .string()
    .regex(/^\d+$/, "Offset must be a positive number")
    .optional(),
});

export const costIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid cost ID format"),
});

/**
 * Professional Fund validation schemas
 * Follows validation rules consistent with ProfessionalFund model
 */
const professionalFundParametersSchemaInternal = z.object({
  contributionRate: z
    .number()
    .min(0, "Contribution rate cannot be negative")
    .max(100, "Contribution rate cannot exceed 100%")
    .refine(
      (val) => Number.isFinite(val) && /^\d+(\.\d{1,2})?$/.test(val.toString()),
      "Contribution rate must have at most 2 decimal places"
    ),
  minimumContribution: z
    .number()
    .min(0, "Minimum contribution cannot be negative")
    .max(999999.99, "Minimum contribution cannot exceed 999,999.99")
    .refine(
      (val) => Number.isFinite(val) && /^\d+(\.\d{1,2})?$/.test(val.toString()),
      "Minimum contribution must have at most 2 decimal places"
    ),
  fixedAnnualContributions: z
    .number()
    .min(0, "Fixed annual contributions cannot be negative")
    .max(999999.99, "Fixed annual contributions cannot exceed 999,999.99")
    .refine(
      (val) => Number.isFinite(val) && /^\d+(\.\d{1,2})?$/.test(val.toString()),
      "Fixed annual contributions must have at most 2 decimal places"
    )
    .default(0),
  year: z
    .number()
    .int("Year must be an integer")
    .min(2000, "Year cannot be before 2000")
    .max(2100, "Year cannot be after 2100"),
});

export const professionalFundCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s.,;:()\-_'"!?&+/\\]+$/,
      "Name contains invalid characters"
    ),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(20, "Code cannot exceed 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Code can only contain uppercase letters, numbers, underscores, and hyphens"
    )
    .transform((val) => val.toUpperCase()),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s.,;:()\-_'"!?€$%&+/\\]*$/,
      "Description contains invalid characters"
    )
    .optional(),
  parameters: z
    .array(professionalFundParametersSchemaInternal)
    .min(1, "At least one parameter set is required")
    .refine((params) => {
      const years = params.map((p) => p.year);
      const uniqueYears = new Set(years);
      return years.length === uniqueYears.size;
    }, "Parameters cannot have duplicate years"),
  allowManualEdit: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const professionalFundUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s.,;:()\-_'"!?&+/\\]+$/,
      "Name contains invalid characters"
    )
    .optional(),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(20, "Code cannot exceed 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Code can only contain uppercase letters, numbers, underscores, and hyphens"
    )
    .transform((val) => val.toUpperCase())
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s.,;:()\-_'"!?€$%&+/\\]*$/,
      "Description contains invalid characters"
    )
    .optional(),
  parameters: z
    .array(professionalFundParametersSchemaInternal)
    .min(1, "At least one parameter set is required")
    .refine((params) => {
      if (!params) return true;
      const years = params.map((p) => p.year);
      const uniqueYears = new Set(years);
      return years.length === uniqueYears.size;
    }, "Parameters cannot have duplicate years")
    .optional(),
  allowManualEdit: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const professionalFundQuerySchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number")
    .refine((val) => {
      const year = parseInt(val);
      return year >= 2000 && year <= new Date().getFullYear() + 10;
    }, "Year must be between 2000 and 10 years in the future")
    .optional(),
  active: z
    .string()
    .regex(/^(true|false)$/, "Active must be true or false")
    .transform((val) => val === "true")
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive number")
    .refine((val) => parseInt(val) <= 1000, "Limit cannot exceed 1000")
    .optional(),
  offset: z
    .string()
    .regex(/^\d+$/, "Offset must be a positive number")
    .optional(),
});

export const professionalFundIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid professional fund ID format"),
});

export const professionalFundCodeParamSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(20, "Code cannot exceed 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Code can only contain uppercase letters, numbers, underscores, and hyphens"
    ),
});
