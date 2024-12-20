import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  taxRegime: 'forfettario' | 'ordinario';
  substituteRate?: number; // 5 or 25
  profitabilityRate?: number; // default 78
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
    enum: [5, 25],
    default: 5,
    required: function(this: IUserSettings) {
      return this.taxRegime === 'forfettario';
    }
  },
  profitabilityRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 78,
    required: function(this: IUserSettings) {
      return this.taxRegime === 'forfettario';
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
UserSettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const UserSettings = mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);
