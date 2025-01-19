import mongoose, { Document, Schema } from 'mongoose';

export interface ICost extends Document {
  userId: mongoose.Types.ObjectId;
  description: string;
  date: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const costSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Indici per ottimizzare le query
costSchema.index({ userId: 1, date: -1 });

export const Cost = mongoose.model<ICost>('Cost', costSchema);
