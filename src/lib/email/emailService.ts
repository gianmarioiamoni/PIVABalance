/**
 * Email Service using Nodemailer + Gmail SMTP
 * Functional approach for PIVABalance email system
 */

import type { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailServiceStatus {
  configured: boolean;
  service: string;
  user?: string;
}

// Module-level state (encapsulated)
let transporter: Transporter | null = null;
let isConfigured = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize Gmail SMTP transporter
 */
async function initializeTransporter(): Promise<void> {
  try {
    // Check if Gmail SMTP is configured
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      console.warn('📧 Gmail SMTP not configured - email sending disabled');
      console.warn('📧 Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
      return;
    }

    // Dynamic import of nodemailer (server-side only)
    const nodemailer = await import('nodemailer');

    // Create Gmail SMTP transporter
    transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    isConfigured = true;
    console.warn('✅ Gmail SMTP configured successfully');
  } catch (error) {
    console.error('❌ Failed to configure Gmail SMTP:', error);
  }
}

/**
 * Ensure email service is initialized
 */
async function ensureInitialized(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = initializeTransporter();
  }
  await initializationPromise;
}

/**
 * Send email using Gmail SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Ensure service is initialized
    await ensureInitialized();

    if (!isConfigured || !transporter) {
      console.warn('📧 Email service not configured - logging email instead');
      console.warn('📧 To:', options.to);
      console.warn('📧 Subject:', options.subject);
      console.warn('📧 Text preview:', options.text.substring(0, 200) + '...');
      return false;
    }

    // Send email via Gmail SMTP
    const result = await transporter.sendMail({
      from: `PIVABalance <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.warn('✅ Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    
    // Fallback to logging
    console.warn('📧 Fallback - logging email content:');
    console.warn('📧 To:', options.to);
    console.warn('📧 Subject:', options.subject);
    
    return false;
  }
}

/**
 * Verify email service configuration
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    // Ensure service is initialized
    await ensureInitialized();

    if (!transporter) {
      return false;
    }

    await transporter.verify();
    console.warn('✅ Gmail SMTP connection verified');
    return true;
  } catch (error) {
    console.error('❌ Gmail SMTP verification failed:', error);
    return false;
  }
}

/**
 * Get email service status
 */
export function getEmailServiceStatus(): EmailServiceStatus {
  return {
    configured: isConfigured,
    service: 'Gmail SMTP',
    user: process.env.GMAIL_USER,
  };
}