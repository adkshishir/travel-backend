import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // Replace with your SMTP host
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process?.env.MAIL_USER, // Your email address
      pass: process.env.MAIL_PASSWORD, // Your email password
    },
  });

  async sendForgotPasswordEmail(to: string, resetToken: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this.transporter.sendMail({
      from: "'Poon HIll' <" + process.env.MAIL_FROM + '>',
      to,
      subject: 'Password Reset Request',
      html: ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <a href="${`${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`}">Reset Password</a> <br/>
          <p>You requested a password reset. Click the button Above to reset your password:</p>
          <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
          <p style="color: #555;">This link is valid for 15 minutes.</p>
        </div>`,
    });
  }
  async sendPdf(to: string, pdfPath: string, fileName: string) {
    await this.transporter.sendMail({
      from: `'Easy Billings' <${process.env.MAIL_FROM}>`,
      to,
      subject: 'Your Billings',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Your Billings</h2>
        <p>Find your Bill attached.</p>
        <p>If you have any questions, please contact us.</p>
      </div>
    `,
      attachments: [
        {
          filename: fileName,
          path: pdfPath, // Path to your generated PDF
          contentType: 'application/pdf',
        },
      ],
    });
  }
  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `'Poon HIll' <${process.env.MAIL_FROM}>`,
      to,
      subject,
      text,
      html,
    });
  }
  async sendEmailVerification(to: string, verifyOtp: string) {
    await this.transporter.sendMail({
      from: `'Poon HIll' <${process.env.MAIL_FROM}>`,
      to,
      subject: 'Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Email Verification</h2>
          <p>Your verification code is: <strong>${verifyOtp}</strong></p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
  }
}
