import mongoose, { Document } from 'mongoose';

export interface IContributions extends Document {
  userId: mongoose.Types.ObjectId;
  year: number;
  previousYearContributions: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const contributionsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  previousYearContributions: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Create a compound index on userId and year to ensure uniqueness
contributionsSchema.index({ userId: 1, year: 1 }, { unique: true });

export const Contributions = mongoose.model<IContributions>('Contributions', contributionsSchema);
