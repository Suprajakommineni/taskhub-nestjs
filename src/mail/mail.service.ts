import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendInviteEmail(toEmail: string, inviteToken: string) {
    const inviteLink = `${process.env.FRONTEND_URL}/complete-invite?token=${inviteToken}`;

    await this.resend.emails.send({
      from: 'TaskHub <onboarding@resend.dev>',
      to: toEmail,
      subject: "You've been invited to TaskHub",
      text: `You've been added to a team on TaskHub. Set up your account here: ${inviteLink}`,
      html: `<p>You've been added to a team on <b>TaskHub</b>.</p>
             <p><a href="${inviteLink}">Click here to set your password and get started</a></p>`,
    });
  }
}
