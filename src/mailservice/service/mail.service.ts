import { Resend } from 'resend';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Seu código de verificação',
      html: `
        <div style="font-family: sans-serif; max-width: 400px;">
          <h2>Recuperação de senha</h2>
          <p>Seu código de verificação é:</p>
          <h1 style="letter-spacing: 8px;">${code}</h1>
          <p>Este código expira em <strong>15 minutos</strong>.</p>
          <p>Se você não solicitou isso, ignore este e-mail.</p>
        </div>
      `,
    });
  }
}
