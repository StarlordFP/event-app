import nodemailer from 'nodemailer';
import { config } from '../config';  

console.log('EMAIL_USER:', config.EMAIL_USER);
console.log('EMAIL_PASS:', config.EMAIL_PASS ? 'SET' : 'EMPTY');

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,   
    pass: config.EMAIL_PASS,   
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${config.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: config.EMAIL_FROM,   
    to: email,
    subject: 'Verify your email',
    html: `
      <h2>Welcome to EventApp!</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};