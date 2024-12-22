import mongoose, { Document, Schema } from 'mongoose';

export interface IProfessionalFund extends Document {
  name: string;
  code: string;
  description?: string;
  parameters: {
    contributionRate: number;  // Percentage (e.g., 16 for 16%)
    minimumContribution: number;  // In euros (e.g., 2750)
    year: number;  // The year these parameters are valid for
  }[];
  allowManualEdit: boolean;  // Whether to allow manual editing of contribution parameters
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProfessionalFundSchema = new Schema<IProfessionalFund>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  parameters: [{
    contributionRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    minimumContribution: {
      type: Number,
      required: true,
      min: 0
    },
    year: {
      type: Number,
      required: true,
      validate: {
        validator: function(v: number) {
          return v >= 2000 && v <= 2100;  // Reasonable range for years
        },
        message: 'Year must be between 2000 and 2100'
      }
    }
  }],
  allowManualEdit: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure parameters array is never empty
ProfessionalFundSchema.pre('save', function(next) {
  if (this.parameters.length === 0) {
    next(new Error('Professional fund must have at least one set of parameters'));
  }
  next();
});

// Create indexes
ProfessionalFundSchema.index({ code: 1 }, { unique: true });
ProfessionalFundSchema.index({ 'parameters.year': 1 });

export const ProfessionalFund = mongoose.model<IProfessionalFund>('ProfessionalFund', ProfessionalFundSchema);
