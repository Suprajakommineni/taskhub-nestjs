// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendInviteEmail(toEmail: string, inviteToken: string) {
    const inviteLink = `${process.env.FRONTEND_URL}/complete-invite?token=${inviteToken}`;

    const info = await this.transporter.sendMail({
      from: '"TaskHub" <no-reply@taskhub.com>',
      to: toEmail,
      subject: "You've been invited to TaskHub",
      text: `You've been added to a team on TaskHub. Set up your account here: ${inviteLink}`,
      html: `<p>You've been added to a team on <b>TaskHub</b>.</p>
             <p><a href="${inviteLink}">Click here to set your password and get started</a></p>`,
    });

    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  }
}
