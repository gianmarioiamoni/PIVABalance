import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  taxRegime: 'forfettario' | 'ordinario';
  substituteRate?: number;
  profitabilityRate?: number;
  pensionSystem: 'INPS' | 'PROFESSIONAL_FUND';
  professionalFundId?: string;
  inpsRateType?: 'COLLABORATOR_WITH_DISCOLL' | 'COLLABORATOR_WITHOUT_DISCOLL' | 'PROFESSIONAL' | 'PENSIONER';
  manualContributionRate?: number;
  manualMinimumContribution?: number;
  manualFixedAnnualContributions?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettings>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  taxRegime: {
    type: String,
    enum: ['forfettario', 'ordinario'],
    required: true,
    default: 'forfettario'
  },
  substituteRate: {
    type: Number,
    validate: {
      validator: function(v: number) {
        return [5, 25].includes(v);
      },
      message: 'Substitute rate must be either 5 or 25'
    },
    default: 5
  },
  profitabilityRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 78
  },
  pensionSystem: {
    type: String,
    enum: ['INPS', 'PROFESSIONAL_FUND'],
    required: true
  },
  professionalFundId: {
    type: String,
    validate: {
      validator: function(this: IUserSettings, v: string | undefined) {
        if (this.pensionSystem === 'PROFESSIONAL_FUND') {
          return typeof v === 'string' && v.length > 0;
        }
        return true;
      },
      message: 'Professional fund ID is required when pension system is PROFESSIONAL_FUND'
    }
  },
  inpsRateType: {
    type: String,
    enum: ['COLLABORATOR_WITH_DISCOLL', 'COLLABORATOR_WITHOUT_DISCOLL', 'PROFESSIONAL', 'PENSIONER'],
    validate: {
      validator: function(this: IUserSettings, v: string | undefined) {
        return this.pensionSystem !== 'INPS' || v !== undefined;
      },
      message: 'INPS rate type is required when pension system is INPS'
    }
  },
  manualContributionRate: {
    type: Number,
    validate: {
      validator: function(this: IUserSettings, v: number | undefined) {
        return !v || (v >= 0 && v <= 100);
      },
      message: 'Manual contribution rate must be between 0 and 100'
    }
  },
  manualMinimumContribution: {
    type: Number,
    validate: {
      validator: function(v: number | undefined) {
        return !v || v >= 0;
      },
      message: 'Manual minimum contribution must be greater than or equal to 0'
    }
  },
  manualFixedAnnualContributions: {
    type: Number,
    validate: {
      validator: function(v: number | undefined) {
        return !v || v >= 0;
      },
      message: 'Manual fixed annual contributions must be greater than or equal to 0'
    }
  }
}, {
  timestamps: true
});

// Update the updatedAt field on save
UserSettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const UserSettings = mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);
