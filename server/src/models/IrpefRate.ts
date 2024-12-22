import mongoose, { Document, Schema } from 'mongoose';

export interface IIrpefRate extends Document {
  rate: number;           // Percentuale dell'aliquota (es. 23 per 23%)
  lowerBound: number;     // Limite inferiore dello scaglione in euro
  upperBound?: number;    // Limite superiore dello scaglione in euro (undefined per l'ultimo scaglione)
  year: number;          // Anno di validità
  isActive: boolean;     // Se l'aliquota è attualmente attiva
  createdAt: Date;
  updatedAt: Date;
}

const IrpefRateSchema = new Schema<IIrpefRate>({
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    validate: {
      validator: (v: number) => v >= 0 && v <= 100,
      message: 'Rate must be between 0 and 100'
    }
  },
  lowerBound: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: (v: number) => v >= 0,
      message: 'Lower bound must be greater than or equal to 0'
    }
  },
  upperBound: {
    type: Number,
    validate: {
      validator: function(this: IIrpefRate, v: number | undefined) {
        if (v === undefined) return true;
        return v > this.lowerBound;
      },
      message: 'Upper bound must be greater than lower bound'
    }
  },
  year: {
    type: Number,
    required: true,
    validate: {
      validator: (v: number) => v >= 2000 && v <= 2100,
      message: 'Year must be between 2000 and 2100'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Assicura che non ci siano sovrapposizioni di scaglioni per lo stesso anno
IrpefRateSchema.pre('save', async function(next) {
  if (this.isModified('lowerBound') || this.isModified('upperBound') || this.isModified('year')) {
    const overlapping = await this.model('IrpefRate').find({
      _id: { $ne: this._id },
      year: this.year,
      isActive: true,
      $or: [
        {
          lowerBound: { $lte: this.lowerBound },
          upperBound: { $gt: this.lowerBound }
        },
        {
          lowerBound: { $lt: this.upperBound },
          upperBound: { $gte: this.upperBound }
        }
      ]
    });

    if (overlapping.length > 0) {
      next(new Error('Tax brackets cannot overlap for the same year'));
    }
  }
  next();
});

export const IrpefRate = mongoose.model<IIrpefRate>('IrpefRate', IrpefRateSchema);
