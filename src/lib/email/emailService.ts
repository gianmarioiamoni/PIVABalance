/**
 * Generic Email Service
 * Extends the existing donation email system to support user registration emails
 *
 * Maintains compatibility with existing donation system
 * Production-ready with Resend email service integration
 */

import { Resend } from 'resend';
import { isValidEmail } from './donation-receipt';

// Initialize Resend client only if API key is available
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  supportEmail: string;
}

export interface AdminNotificationData {
  newUserName: string;
  newUserEmail: string;
  registrationDate: Date;
  adminEmail: string;
}

/**
 * Generate welcome email content for new users
 */
export function generateWelcomeEmail(data: WelcomeEmailData): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `Benvenuto in PIVABalance! 🚀`;

  const text = `
Ciao ${data.userName},

Benvenuto in PIVABalance! 🎉

La tua registrazione è stata completata con successo. Ora puoi iniziare a gestire la tua attività di freelancer con tutti gli strumenti di cui hai bisogno:

✅ Gestione fatture e costi
✅ Calcoli fiscali automatici  
✅ Dashboard personalizzabile
✅ Analytics avanzate
✅ Report PDF/Excel

Per iniziare, accedi al tuo account e esplora le funzionalità disponibili.

Se hai domande o hai bisogno di supporto, non esitare a contattarmi a: ${data.supportEmail}

Buon lavoro con PIVABalance!

Il team PIVABalance
${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}

---
Questa email è stata inviata perché ti sei registrato su PIVABalance.
Se hai domande, rispondi pure a questa email.
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Benvenuto in PIVABalance</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🚀 PIVABalance</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0;">Gestione finanziaria per Partite IVA</p>
  </div>

  <!-- Main Content -->
  <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
    <h2 style="color: #2c3e50; margin-top: 0;">Benvenuto in PIVABalance! 🎉</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Ciao <strong>${data.userName}</strong>,
    </p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      La tua registrazione è stata completata con successo! Ora puoi iniziare a gestire la tua attività di freelancer con tutti gli strumenti di cui hai bisogno.
    </p>

    <!-- Features Section -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
      <h3 style="color: #2c3e50; margin-top: 0;">Cosa puoi fare con PIVABalance:</h3>
      <ul style="color: #555; padding-left: 20px;">
        <li>✅ Gestione fatture e costi</li>
        <li>🧮 Calcoli fiscali automatici</li>
        <li>🎛️ Dashboard personalizzabile</li>
        <li>📊 Analytics avanzate</li>
        <li>📄 Report PDF/Excel</li>
      </ul>
    </div>

    <!-- Support Section -->
    <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
      <p style="margin: 0; color: #2c3e50;">
        <strong>Hai bisogno di aiuto?</strong><br>
        Non esitare a contattarmi a: <a href="mailto:${data.supportEmail}" style="color: #3498db;">${data.supportEmail}</a>
      </p>
    </div>

    <p style="font-size: 16px; color: #2c3e50; margin-top: 30px;">
      Per iniziare, accedi al tuo account e esplora le funzionalità disponibili.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Accedi alla Dashboard
      </a>
    </div>
    
    <p style="font-size: 18px; text-align: center; margin: 30px 0;">
      <strong>Buon lavoro con PIVABalance! 💼</strong>
    </p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p style="margin: 0;">
      Il team PIVABalance<br>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #3498db; text-decoration: none;">${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}</a>
    </p>
    <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
      Questa email è stata inviata perché ti sei registrato su PIVABalance.<br>
      Se hai domande, rispondi pure a questa email.
    </p>
  </div>

</body>
</html>
  `.trim();

  return { subject, text, html };
}

/**
 * Generate admin notification email for new user registrations
 */
export function generateAdminNotificationEmail(data: AdminNotificationData): {
  subject: string;
  text: string;
  html: string;
} {
  const formattedDate = new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(data.registrationDate);

  const subject = `🆕 Nuovo utente registrato su PIVABalance`;

  const text = `
Ciao,

Un nuovo utente si è registrato su PIVABalance:

👤 Nome: ${data.newUserName}
📧 Email: ${data.newUserEmail}
📅 Data registrazione: ${formattedDate}

Puoi visualizzare i dettagli dell'utente nel pannello di amministrazione.

---
Notifica automatica da PIVABalance
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nuovo utente registrato - PIVABalance</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🆕 PIVABalance</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0;">Notifica Amministratore</p>
  </div>

  <!-- Main Content -->
  <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
    <h2 style="color: #2c3e50; margin-top: 0;">Nuovo utente registrato</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Un nuovo utente si è registrato su PIVABalance:
    </p>

    <!-- User Info -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #2c3e50; width: 120px;">👤 Nome:</td>
          <td style="padding: 8px 0; color: #555;">${data.newUserName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">📧 Email:</td>
          <td style="padding: 8px 0; color: #555;"><a href="mailto:${data.newUserEmail}" style="color: #3498db;">${data.newUserEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">📅 Data:</td>
          <td style="padding: 8px 0; color: #555;">${formattedDate}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      Puoi visualizzare i dettagli dell'utente nel pannello di amministrazione.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/admin" style="display: inline-block; background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Pannello Admin
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p style="margin: 0;">
      Notifica automatica da PIVABalance<br>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #3498db; text-decoration: none;">${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}</a>
    </p>
  </div>

</body>
</html>
  `.trim();

  return { subject, text, html };
}

/**
 * Send welcome email to new user
 * Production-ready with Resend email service
 */
export async function sendWelcomeEmail(
  data: WelcomeEmailData
): Promise<boolean> {
  try {
    // Validate email
    if (!isValidEmail(data.userEmail)) {
      console.error('Invalid email address:', data.userEmail);
      return false;
    }

    // Get Resend client
    const resend = getResendClient();
    if (!resend) {
      console.warn('📧 RESEND_API_KEY not configured - Welcome email not sent');
      return false;
    }

    // Check if in development and email is not the admin email
    const isDevMode = process.env.NODE_ENV === 'development';
    const adminEmail = process.env.ADMIN_EMAIL || 'gianmarioiamoni1@gmail.com';

    if (isDevMode && data.userEmail !== adminEmail) {
      console.log(`📧 [DEV] Welcome email redirected: ${data.userEmail} → ${adminEmail}`);
    }

    // Generate email content
    const emailContent = generateWelcomeEmail(data);

    // In development, send to admin email; in production, send to user
    const recipientEmail =
      isDevMode && data.userEmail !== adminEmail ? adminEmail : data.userEmail;

    // Send email via Resend
    const result = await resend.emails.send({
      from: `PIVABalance <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
      to: recipientEmail,
      subject:
        isDevMode && recipientEmail === adminEmail
          ? `[DEV] ${emailContent.subject} (per ${data.userEmail})`
          : emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (result.error) {
      console.error('Resend error sending welcome email:', result.error);
      return false;
    }

    console.log(`✅ Welcome email sent to: ${recipientEmail} (ID: ${result.data?.id})`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

/**
 * Send admin notification email for new user registration
 * Production-ready with Resend email service
 */
export async function sendAdminNotificationEmail(
  data: AdminNotificationData
): Promise<boolean> {
  try {
    // Validate admin email
    if (!isValidEmail(data.adminEmail)) {
      console.error('Invalid admin email address:', data.adminEmail);
      return false;
    }

    // Get Resend client
    const resend = getResendClient();
    if (!resend) {
      console.warn('📧 RESEND_API_KEY not configured - Admin notification not sent');
      return false;
    }

    // Generate email content
    const emailContent = generateAdminNotificationEmail(data);

    // Send email via Resend
    const result = await resend.emails.send({
      from: `PIVABalance <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
      to: data.adminEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (result.error) {
      console.error('Resend error sending admin notification:', result.error);
      return false;
    }

    console.log(`✅ Admin notification sent: ${data.newUserName} <${data.newUserEmail}> (ID: ${result.data?.id})`);
    return true;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return false;
  }
}

/**
 * Send both welcome email to user and notification to admin
 * This is the main function to call after user registration
 */
export async function sendRegistrationEmails(
  userName: string,
  userEmail: string,
  supportEmail: string = 'gianmarioiamoni1@gmail.com',
  adminEmail: string = 'gianmarioiamoni1@gmail.com'
): Promise<{ welcomeSent: boolean; adminNotificationSent: boolean }> {
  const registrationDate = new Date();

  // Send welcome email to user
  const welcomeSent = await sendWelcomeEmail({
    userName,
    userEmail,
    supportEmail,
  });

  // Send notification to admin
  const adminNotificationSent = await sendAdminNotificationEmail({
    newUserName: userName,
    newUserEmail: userEmail,
    registrationDate,
    adminEmail,
  });

  return { welcomeSent, adminNotificationSent };
}
