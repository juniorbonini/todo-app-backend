/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { CreateMailserviceDto } from '../dto/create-mailservice.dto';
import { UpdateMailserviceDto } from '../dto/update-mailservice.dto';

@Injectable()
export class MailService {
  create(createMailserviceDto: CreateMailserviceDto) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: number) {
    throw new Error('Method not implemented.');
  }
  update(arg0: number, updateMailserviceDto: UpdateMailserviceDto) {
    throw new Error('Method not implemented.');
  }
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  private resend: Resend;

  constructor() {
    this.resend = new Resend('re_T1cCUA1d_7mx6onfD4vNq5YsVyDh9UZVK');
  }

  async sendVerificationCode(email: string, code: string) {
    const result = await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Seu código da verificação',
      html: `<strong>Seu código é: ${code}</strong>. Ele expira em 15 minutos`,
    });

    return result;
  }
}
