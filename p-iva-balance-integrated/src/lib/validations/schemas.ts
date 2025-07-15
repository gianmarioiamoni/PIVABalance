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
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
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
    taxRegime: z.enum(["forfettario", "ordinario"], {
      errorMap: () => ({
        message: "Regime fiscale deve essere 'forfettario' o 'ordinario'",
      }),
    }),
    substituteRate: z.number().min(0).max(100).optional(),
    profitabilityRate: z.number().min(0).max(100).optional(),
    pensionSystem: z.enum(["INPS", "PROFESSIONAL_FUND"], {
      errorMap: () => ({
        message:
          "Sistema previdenziale deve essere 'INPS' o 'PROFESSIONAL_FUND'",
      }),
    }),
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
