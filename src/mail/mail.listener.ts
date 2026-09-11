import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from './mail.service';

@Injectable()
export class MailListener {
  constructor(private mailService: MailService) {}

  @OnEvent('member.invited')
  async handleMemberInvited(payload: { email: string; inviteToken: string }) {
    await this.mailService.sendInviteEmail(payload.email, payload.inviteToken);
  }
}
