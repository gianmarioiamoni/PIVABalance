import { api } from './api';
import { DonationRequest, DonationResponse, StripePaymentIntent, DonationStats } from '@/types';

/**
 * Donation Service
 * 
 * Handles all donation-related API calls and business logic.
 * GDPR compliant with minimal data collection and secure payment processing.
 */
export class DonationService {
  
  /**
   * Create a payment intent for donation
   * Returns Stripe client secret for frontend processing
   */
  async createPaymentIntent(donationData: DonationRequest): Promise<StripePaymentIntent> {
    const response = await api.post<StripePaymentIntent>('/donations/create-payment-intent', donationData);
    return response;
  }

  /**
   * Confirm a donation after successful payment
   * Updates donation status and processes receipt
   */
  async confirmDonation(paymentIntentId: string): Promise<DonationResponse> {
    const response = await api.post<DonationResponse>('/donations/confirm', {
      paymentIntentId
    });
    return response;
  }

  /**
   * Get donation statistics for transparency
   * Returns anonymized aggregate data
   */
  async getDonationStats(): Promise<DonationStats> {
    const response = await api.get<DonationStats>('/donations/stats');
    return response;
  }

  /**
   * Get user's donation history (if logged in)
   * Returns only user's own donations with privacy protection
   */
  async getUserDonations(): Promise<DonationResponse[]> {
    const response = await api.get<DonationResponse[]>('/donations/my-donations');
    return response;
  }

  /**
   * Get recent donations for public display (anonymized)
   * Used for social proof and transparency
   */
  async getRecentDonations(limit: number = 10): Promise<DonationResponse[]> {
    const response = await api.get<DonationResponse[]>(`/donations/recent?limit=${limit}`);
    return response;
  }

  /**
   * Validate donation amount
   * Client-side validation before API call
   */
  validateDonationAmount(amount: number): { isValid: boolean; error?: string } {
    if (amount < 100) { // Minimum €1.00
      return { isValid: false, error: 'L\'importo minimo è €1.00' };
    }
    
    if (amount > 10000000) { // Maximum €100,000
      return { isValid: false, error: 'L\'importo massimo è €100,000' };
    }
    
    if (!Number.isInteger(amount)) {
      return { isValid: false, error: 'L\'importo deve essere un numero intero in centesimi' };
    }
    
    return { isValid: true };
  }

  /**
   * Format amount for display
   * Converts cents to euros with proper formatting
   */
  formatAmount(amountInCents: number): string {
    const euros = amountInCents / 100;
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(euros);
  }

  /**
   * Parse amount from user input
   * Converts euros to cents for API
   */
  parseAmount(euroAmount: string | number): number {
    const amount = typeof euroAmount === 'string' ? parseFloat(euroAmount) : euroAmount;
    return Math.round(amount * 100);
  }

  /**
   * Get suggested donation amounts
   * Returns array of common donation amounts in cents
   */
  getSuggestedAmounts(): { amount: number; label: string; description: string }[] {
    return [
      {
        amount: 500, // €5.00
        label: '€5',
        description: 'Un caffè per il team'
      },
      {
        amount: 1000, // €10.00
        label: '€10',
        description: 'Supporto base mensile'
      },
      {
        amount: 2500, // €25.00
        label: '€25',
        description: 'Contributo significativo'
      },
      {
        amount: 5000, // €50.00
        label: '€50',
        description: 'Sostenitore generoso'
      },
      {
        amount: 10000, // €100.00
        label: '€100',
        description: 'Sponsor del progetto'
      }
    ];
  }

  /**
   * Get donation impact messages
   * Returns motivational messages based on amount
   */
  getImpactMessage(amountInCents: number): string {
    const euros = amountInCents / 100;
    
    if (euros >= 100) {
      return '🚀 Contributo straordinario! Aiuti a mantenere il servizio gratuito per tutti.';
    } else if (euros >= 50) {
      return '💎 Donazione generosa! Supporti lo sviluppo di nuove funzionalità.';
    } else if (euros >= 25) {
      return '⭐ Contributo significativo! Aiuti a coprire i costi del server.';
    } else if (euros >= 10) {
      return '☕ Grazie! Il tuo supporto aiuta a mantenere il progetto attivo.';
    } else {
      return '❤️ Ogni contributo conta! Grazie per il tuo supporto.';
    }
  }

  /**
   * Check if donation is eligible for tax deduction (Italy)
   * Returns information about tax benefits
   */
  getTaxDeductionInfo(amountInCents: number): { eligible: boolean; info: string } {
    // In Italy, donations to certain organizations can be tax deductible
    // This would need to be configured based on the organization's status
    return {
      eligible: false,
      info: 'Le donazioni a PIVABalance non sono attualmente deducibili fiscalmente.'
    };
  }

  /**
   * Generate donation receipt data
   * Creates receipt information for successful donations
   */
  generateReceiptData(donation: DonationResponse): {
    receiptNumber: string;
    date: string;
    amount: string;
    description: string;
  } {
    const receiptDate = new Date(donation.processedAt || donation.createdAt);
    
    return {
      receiptNumber: `PIV-${donation.id.slice(-8).toUpperCase()}`,
      date: receiptDate.toLocaleDateString('it-IT'),
      amount: this.formatAmount(donation.amount),
      description: `Donazione volontaria a PIVABalance${donation.message ? ` - ${donation.message}` : ''}`
    };
  }
}

/**
 * Export singleton instance
 */
export const donationService = new DonationService();
export default donationService;
