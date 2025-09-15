import mongoose, { Schema, Document } from 'mongoose';

/**
 * Donation Interface
 * 
 * Represents a voluntary donation made by users to support the platform.
 * GDPR compliant with minimal data collection and automatic cleanup.
 */
export interface IDonation extends Document {
  // Payment Information
  stripePaymentIntentId: string;
  amount: number; // In cents (EUR)
  currency: string; // 'eur'
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  
  // Donor Information (minimal for GDPR compliance)
  donorEmail?: string; // Optional - only if user wants receipt
  donorName?: string; // Optional - for thank you message
  isAnonymous: boolean;
  
  // User Association (if logged in)
  userId?: string; // Optional - for logged in users
  
  // Donation Context
  donationType: 'one-time' | 'monthly'; // Future: recurring donations
  message?: string; // Optional message from donor
  
  // Privacy & GDPR
  consentToContact: boolean; // Explicit consent for future contact
  dataRetentionDate: Date; // Auto-deletion date (GDPR Art. 17)
  
  // Metadata
  paymentMethod: string; // 'card', 'sepa', etc.
  country?: string; // For analytics (anonymized)
  source: 'web' | 'mobile' | 'api'; // Platform source
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date; // When payment was processed
}

/**
 * Donation Schema
 * 
 * Mongoose schema for donation documents with privacy-first design.
 * Implements automatic data cleanup for GDPR compliance.
 */
const donationSchema = new Schema<IDonation>({
  // Payment Information
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 100, // Minimum €1.00
    max: 10000000, // Maximum €100,000
  },
  currency: {
    type: String,
    required: true,
    default: 'eur',
    enum: ['eur'],
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'succeeded', 'failed', 'canceled'],
    default: 'pending',
    index: true,
  },
  
  // Donor Information (GDPR minimized)
  donorEmail: {
    type: String,
    required: false,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  donorName: {
    type: String,
    required: false,
    maxlength: 100,
    trim: true,
  },
  isAnonymous: {
    type: Boolean,
    required: true,
    default: false,
  },
  
  // User Association
  userId: {
    type: String,
    required: false,
    index: true,
  },
  
  // Donation Context
  donationType: {
    type: String,
    required: true,
    enum: ['one-time', 'monthly'],
    default: 'one-time',
  },
  message: {
    type: String,
    required: false,
    maxlength: 500,
    trim: true,
  },
  
  // Privacy & GDPR
  consentToContact: {
    type: Boolean,
    required: true,
    default: false,
  },
  dataRetentionDate: {
    type: Date,
    required: true,
    default: function() {
      // Auto-delete after 7 years (legal requirement for financial records)
      const date = new Date();
      date.setFullYear(date.getFullYear() + 7);
      return date;
    },
    index: { expireAfterSeconds: 0 }, // MongoDB TTL index
  },
  
  // Metadata
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'sepa_debit', 'ideal', 'bancontact', 'sofort'],
  },
  country: {
    type: String,
    required: false,
    length: 2, // ISO country code
    uppercase: true,
  },
  source: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'api'],
    default: 'web',
  },
  
  // Timestamps
  processedAt: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'donations',
});

/**
 * Indexes for performance and GDPR compliance
 */
donationSchema.index({ createdAt: -1 }); // Recent donations first
donationSchema.index({ userId: 1, createdAt: -1 }); // User donations
donationSchema.index({ status: 1, createdAt: -1 }); // Status filtering
donationSchema.index({ dataRetentionDate: 1 }); // TTL cleanup

/**
 * Pre-save middleware for data validation and privacy
 */
donationSchema.pre('save', function(next) {
  // If anonymous, remove personal data
  if (this.isAnonymous) {
    this.donorEmail = undefined;
    this.donorName = undefined;
    this.consentToContact = false;
  }
  
  // Ensure data retention compliance
  if (!this.dataRetentionDate) {
    const retentionDate = new Date();
    retentionDate.setFullYear(retentionDate.getFullYear() + 7);
    this.dataRetentionDate = retentionDate;
  }
  
  next();
});

/**
 * Instance Methods
 */
donationSchema.methods.toJSON = function() {
  const donation = this.toObject();
  
  // Remove sensitive data from JSON output
  delete donation.stripePaymentIntentId;
  
  // If anonymous, remove personal data
  if (donation.isAnonymous) {
    delete donation.donorEmail;
    delete donation.donorName;
    delete donation.userId;
  }
  
  return donation;
};

/**
 * Static Methods for Business Logic
 */
donationSchema.statics.getTotalDonations = async function() {
  const result = await this.aggregate([
    { $match: { status: 'succeeded' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return result[0]?.total || 0;
};

donationSchema.statics.getMonthlyDonations = async function(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  const result = await this.aggregate([
    {
      $match: {
        status: 'succeeded',
        processedAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result[0] || { total: 0, count: 0 };
};

donationSchema.statics.getDonationStats = async function() {
  const result = await this.aggregate([
    { $match: { status: 'succeeded' } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalCount: { $sum: 1 },
        averageAmount: { $avg: '$amount' },
        lastDonation: { $max: '$processedAt' }
      }
    }
  ]);
  
  return result[0] || {
    totalAmount: 0,
    totalCount: 0,
    averageAmount: 0,
    lastDonation: null
  };
};

/**
 * Export the Donation model
 */
export const Donation = mongoose.models.Donation || mongoose.model<IDonation>('Donation', donationSchema);

export default Donation;
