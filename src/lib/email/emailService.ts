/**
 * Email Service using Nodemailer + Gmail SMTP
 * Centralized email service for PIVABalance
 */

import type { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    // Initialize lazily when first needed
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeTransporter();
    }
    await this.initializationPromise;
  }

  private async initializeTransporter(): Promise<void> {
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
      this.transporter = nodemailer.default.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPassword,
        },
      });

      this.isConfigured = true;
      console.warn('✅ Gmail SMTP configured successfully');
    } catch (error) {
      console.error('❌ Failed to configure Gmail SMTP:', error);
    }
  }

  /**
   * Send email using Gmail SMTP
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Ensure service is initialized
      await this.ensureInitialized();

      if (!this.isConfigured || !this.transporter) {
        console.warn('📧 Email service not configured - logging email instead');
        console.warn('📧 To:', options.to);
        console.warn('📧 Subject:', options.subject);
        console.warn('📧 Text preview:', options.text.substring(0, 200) + '...');
        return false;
      }

      // Send email via Gmail SMTP
      const result = await this.transporter.sendMail({
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
  async verifyConnection(): Promise<boolean> {
    try {
      // Ensure service is initialized
      await this.ensureInitialized();

      if (!this.transporter) {
        return false;
      }

      await this.transporter.verify();
      console.warn('✅ Gmail SMTP connection verified');
      return true;
    } catch (error) {
      console.error('❌ Gmail SMTP verification failed:', error);
      return false;
    }
  }

  /**
   * Get service status
   */
  getStatus(): {
    configured: boolean;
    service: string;
    user?: string;
  } {
    return {
      configured: this.isConfigured,
      service: 'Gmail SMTP',
      user: process.env.GMAIL_USER,
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export types
export type { EmailOptions };
