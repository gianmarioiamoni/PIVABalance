/**
 * Donation Email Service
 * Simple email system for donation receipts and thank you messages
 *
 * Production-ready with Resend email service integration
 */

import { Resend } from 'resend';

// Initialize Resend client only if API key is available
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export interface DonationEmailData {
  donorName?: string;
  donorEmail: string;
  amount: number; // in cents
  currency: string;
  donationId: string;
  stripeReceiptUrl?: string;
  message?: string;
  isAnonymous: boolean;
}

/**
 * Generate thank you email content
 */
export function generateThankYouEmail(data: DonationEmailData): {
  subject: string;
  text: string;
  html: string;
} {
  const formattedAmount = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(data.amount / 100);

  const donorGreeting =
    data.isAnonymous || !data.donorName
      ? 'Caro sostenitore'
      : `Ciao ${data.donorName}`;

  const subject = `Grazie per la tua donazione a PIVABalance! 💙`;

  const text = `
${donorGreeting},

Grazie di cuore per aver supportato PIVABalance con una donazione di ${formattedAmount}!

Il tuo contributo ci aiuta a:
• Mantenere il servizio completamente gratuito
• Sviluppare nuove funzionalità per freelancer e Partite IVA
• Coprire i costi del server e dell'infrastruttura
• Rimanere indipendenti senza pubblicità

${data.message ? `Il tuo messaggio: "${data.message}"` : ''}

ID Donazione: ${data.donationId}
${data.stripeReceiptUrl ? `Ricevuta Stripe: ${data.stripeReceiptUrl}` : ''}

Il tuo supporto significa molto per noi e per tutta la comunità di freelancer che usa PIVABalance.

Grazie ancora! 🙏

Il team PIVABalance
${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}

---
Questa email è stata inviata perché hai effettuato una donazione su PIVABalance.
Se hai domande, rispondi pure a questa email.
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Grazie per la donazione - PIVABalance</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
    <h1 style="color: white; margin: 0; font-size: 24px;">💙 PIVABalance</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0;">Gestione finanziaria per Partite IVA</p>
  </div>

  <!-- Main Content -->
  <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
    <h2 style="color: #2c3e50; margin-top: 0;">Grazie per la tua donazione! 🎉</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      ${donorGreeting},
    </p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Grazie di cuore per aver supportato PIVABalance con una donazione di 
      <strong style="color: #27ae60; font-size: 18px;">${formattedAmount}</strong>!
    </p>

    <!-- Impact Section -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
      <h3 style="color: #2c3e50; margin-top: 0;">Il tuo contributo ci aiuta a:</h3>
      <ul style="color: #555; padding-left: 20px;">
        <li>✅ Mantenere il servizio completamente gratuito</li>
        <li>🚀 Sviluppare nuove funzionalità per freelancer e Partite IVA</li>
        <li>🖥️ Coprire i costi del server e dell'infrastruttura</li>
        <li>🔓 Rimanere indipendenti senza pubblicità</li>
      </ul>
    </div>

    ${
      data.message
        ? `
    <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
      <p style="margin: 0; font-style: italic; color: #2c3e50;">
        <strong>Il tuo messaggio:</strong> "${data.message}"
      </p>
    </div>
    `
        : ''
    }

    <!-- Receipt Info -->
    <div style="background: #f1f2f6; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #666;">
      <p style="margin: 0;"><strong>ID Donazione:</strong> ${
        data.donationId
      }</p>
      ${
        data.stripeReceiptUrl
          ? `<p style="margin: 5px 0 0 0;"><strong>Ricevuta Stripe:</strong> <a href="${data.stripeReceiptUrl}" style="color: #3498db;">Visualizza ricevuta</a></p>`
          : ''
      }
    </div>

    <p style="font-size: 16px; color: #2c3e50; margin-top: 30px;">
      Il tuo supporto significa molto per noi e per tutta la comunità di freelancer che usa PIVABalance.
    </p>
    
    <p style="font-size: 18px; text-align: center; margin: 30px 0;">
      <strong>Grazie ancora! 🙏</strong>
    </p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p style="margin: 0;">
      Il team PIVABalance<br>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #3498db; text-decoration: none;">${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}</a>
    </p>
    <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
      Questa email è stata inviata perché hai effettuato una donazione su PIVABalance.<br>
      Se hai domande, rispondi pure a questa email.
    </p>
  </div>

</body>
</html>
  `.trim();

  return { subject, text, html };
}

/**
 * Send donation receipt email
 * Production-ready with Resend email service
 */
export async function sendDonationReceipt(
  data: DonationEmailData
): Promise<boolean> {
  try {
    // Validate email
    if (!isValidEmail(data.donorEmail)) {
      console.error('Invalid donor email address:', data.donorEmail);
      return false;
    }

    // Get Resend client
    const resend = getResendClient();
    if (!resend) {
      console.warn(
        '📧 RESEND_API_KEY not configured - Donation receipt not sent'
      );
      console.warn('📧 DONATION RECEIPT EMAIL - To:', data.donorEmail);
      return false;
    }

    // Generate email content
    const emailContent = generateThankYouEmail(data);

    // Send email via Resend
    const result = await resend.emails.send({
      from: `PIVABalance <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
      to: data.donorEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (result.error) {
      console.error('Resend error sending donation receipt:', result.error);
      return false;
    }

      console.log(`✅ Donation receipt sent to: ${data.donorEmail} (ID: ${result.data?.id})`);
    return true;
  } catch (error) {
    console.error('Error sending donation receipt:', error);
    return false;
  }
}

/**
 * Simple email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
