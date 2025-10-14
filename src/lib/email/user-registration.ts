/**
 * User Registration Email Service
 * Email system for user welcome and admin notifications using Gmail SMTP
 */

import { sendEmail } from './emailService';

export interface UserRegistrationEmailData {
  userName: string;
  userEmail: string;
  userId: string;
  registrationDate: Date;
  dashboardUrl: string;
}

export interface AdminNotificationEmailData {
  userName: string;
  userEmail: string;
  userId: string;
  registrationDate: Date;
  adminPanelUrl: string;
  totalUsers?: number;
}

/**
 * Generate welcome email content for new users
 */
export function generateWelcomeEmail(data: UserRegistrationEmailData): {
  subject: string;
  text: string;
  html: string;
} {
  const formattedDate = new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data.registrationDate);

  const subject = `Benvenuto in PIVABalance! 🎉`;

  const text = `
Ciao ${data.userName},

Benvenuto in PIVABalance! 🎉

La tua registrazione è stata completata con successo il ${formattedDate}.

PIVABalance ti aiuterà a:
• Gestire le tue entrate e uscite
• Calcolare le tasse in modo semplice
• Tenere traccia delle fatture
• Monitorare la tua situazione finanziaria
• Rimanere in regola con il fisco

🚀 Inizia subito:
Accedi alla tua dashboard: ${data.dashboardUrl}

💡 Suggerimenti per iniziare:
1. Configura le tue impostazioni fiscali
2. Aggiungi la tua prima fattura
3. Inserisci i tuoi costi
4. Monitora il tuo bilancio

Hai domande? Rispondi pure a questa email, siamo qui per aiutarti!

Buon lavoro con PIVABalance! 💪

Il team PIVABalance
https://pivabalance.com

---
Questa email è stata inviata perché ti sei registrato su PIVABalance.
ID Utente: ${data.userId}
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
    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 PIVABalance</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0;">Gestione finanziaria per Partite IVA</p>
  </div>

  <!-- Main Content -->
  <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
    <h2 style="color: #2c3e50; margin-top: 0;">Benvenuto in PIVABalance! 🎉</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Ciao <strong>${data.userName}</strong>,
    </p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      La tua registrazione è stata completata con successo il <strong>${formattedDate}</strong>.
    </p>

    <!-- Features Section -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
      <h3 style="color: #2c3e50; margin-top: 0;">PIVABalance ti aiuterà a:</h3>
      <ul style="color: #555; padding-left: 20px;">
        <li>💰 Gestire le tue entrate e uscite</li>
        <li>🧮 Calcolare le tasse in modo semplice</li>
        <li>📄 Tenere traccia delle fatture</li>
        <li>📊 Monitorare la tua situazione finanziaria</li>
        <li>✅ Rimanere in regola con il fisco</li>
      </ul>
    </div>

    <!-- CTA Section -->
    <div style="text-align: center; margin: 30px 0;">
      <h3 style="color: #2c3e50; margin-bottom: 15px;">🚀 Inizia subito:</h3>
      <a href="${data.dashboardUrl}" 
         style="display: inline-block; background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Accedi alla Dashboard
      </a>
    </div>

    <!-- Getting Started -->
    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
      <h3 style="color: #2c3e50; margin-top: 0;">💡 Suggerimenti per iniziare:</h3>
      <ol style="color: #555; padding-left: 20px;">
        <li>Configura le tue impostazioni fiscali</li>
        <li>Aggiungi la tua prima fattura</li>
        <li>Inserisci i tuoi costi</li>
        <li>Monitora il tuo bilancio</li>
      </ol>
    </div>

    <p style="font-size: 16px; color: #2c3e50; margin-top: 30px;">
      Hai domande? Rispondi pure a questa email, siamo qui per aiutarti!
    </p>
    
    <p style="font-size: 18px; text-align: center; margin: 30px 0;">
      <strong>Buon lavoro con PIVABalance! 💪</strong>
    </p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p style="margin: 0;">
      Il team PIVABalance<br>
      <a href="https://pivabalance.com" style="color: #3498db; text-decoration: none;">https://pivabalance.com</a>
    </p>
    <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
      Questa email è stata inviata perché ti sei registrato su PIVABalance.<br>
      ID Utente: ${data.userId}
    </p>
  </div>

</body>
</html>
  `.trim();

  return { subject, text, html };
}

/**
 * Generate admin notification email content for new user registrations
 */
export function generateAdminNotificationEmail(
  data: AdminNotificationEmailData
): {
  subject: string;
  text: string;
  html: string;
} {
  const formattedDate = new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data.registrationDate);

  const subject = `[PIVABalance] Nuovo utente registrato: ${data.userName}`;

  const text = `
Nuovo utente registrato su PIVABalance!

Dettagli utente:
• Nome: ${data.userName}
• Email: ${data.userEmail}
• ID: ${data.userId}
• Data registrazione: ${formattedDate}
${data.totalUsers ? `• Totale utenti: ${data.totalUsers}` : ''}

Gestisci utenti: ${data.adminPanelUrl}

---
PIVABalance Admin System
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
  <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border-radius: 10px;">
    <h1 style="color: white; margin: 0; font-size: 20px;">🔔 PIVABalance Admin</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0;">Notifica nuovo utente</p>
  </div>

  <!-- Main Content -->
  <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
    <h2 style="color: #2c3e50; margin-top: 0;">Nuovo utente registrato! 🎉</h2>
    
    <!-- User Details -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
      <h3 style="color: #2c3e50; margin-top: 0;">Dettagli utente:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Nome:</td>
          <td style="padding: 8px 0; color: #333;">${data.userName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
          <td style="padding: 8px 0; color: #333;">${data.userEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">ID:</td>
          <td style="padding: 8px 0; color: #333; font-family: monospace;">${data.userId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">Registrazione:</td>
          <td style="padding: 8px 0; color: #333;">${formattedDate}</td>
        </tr>
        ${
          data.totalUsers
            ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #555;">Totale utenti:</td>
          <td style="padding: 8px 0; color: #333;">${data.totalUsers}</td>
        </tr>
        `
            : ''
        }
      </table>
    </div>

    <!-- CTA Section -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.adminPanelUrl}" 
         style="display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Gestisci Utenti
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p style="margin: 0;">
      PIVABalance Admin System<br>
      <span style="font-size: 12px; color: #999;">Notifica automatica di sistema</span>
    </p>
  </div>

</body>
</html>
  `.trim();

  return { subject, text, html };
}

/**
 * Send welcome email to new user using Gmail SMTP
 */
export async function sendWelcomeEmail(
  data: UserRegistrationEmailData
): Promise<boolean> {
  try {
    // Generate email content
    const emailContent = generateWelcomeEmail(data);

    // Send email via Gmail SMTP service
    const success = await sendEmail({
      to: data.userEmail,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    if (!success) {
      console.warn('⚠️ Welcome email not sent (service not configured)');
    }

    return success;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
}

/**
 * Send admin notification email for new user registration using Gmail SMTP
 */
export async function sendAdminNotificationEmail(
  data: AdminNotificationEmailData
): Promise<boolean> {
  try {
    // Generate email content
    const emailContent = generateAdminNotificationEmail(data);

    // Send email via Gmail SMTP service
    const adminEmail = process.env.ADMIN_EMAIL || 'gianmarioiamoni1@gmail.com';
    const success = await sendEmail({
      to: adminEmail,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    if (success) {
      console.warn('📧 New user registered:', data.userName, '-', data.userEmail);
    } else {
      console.warn('⚠️ Admin notification not sent (service not configured)');
    }

    return success;
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
    return false;
  }
}

/**
 * Simple email validation (reused from donation system)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
