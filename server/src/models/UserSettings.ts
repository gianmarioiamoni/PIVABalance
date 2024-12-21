import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  taxRegime: 'forfettario' | 'ordinario';
  substituteRate: number;
  profitabilityRate: number;
  pensionSystem: 'INPS' | 'PROFESSIONAL_FUND';
  professionalFundId?: string;
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
    required: true,
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
    required: true,
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
    required: function(this: IUserSettings) {
      return this.pensionSystem === 'PROFESSIONAL_FUND';
    },
    validate: {
      validator: function(this: IUserSettings, v: string | undefined) {
        if (this.pensionSystem === 'PROFESSIONAL_FUND') {
          return typeof v === 'string' && v.length > 0;
        }
        return true;
      },
      message: 'Professional fund ID is required when pension system is PROFESSIONAL_FUND'
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
