import mongoose, { Schema, Document } from 'mongoose';

export interface IPreviousYearContribution extends Document {
    userId: string;
    year: number;
    amount: number;
}

const PreviousYearContributionSchema = new Schema({
    userId: { type: String, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
}, { timestamps: true });

// Create a compound index on userId and year to ensure uniqueness
PreviousYearContributionSchema.index({ userId: 1, year: 1 }, { unique: true });

export default mongoose.model<IPreviousYearContribution>('PreviousYearContribution', PreviousYearContributionSchema);
