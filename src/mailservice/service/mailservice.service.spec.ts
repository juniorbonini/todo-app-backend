/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// mail.service.spec.ts
import { beforeEach, describe, expect, it } from '@jest/globals';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mailservice.service';

describe('MailService (E2E/Integration)', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: './env' })],
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('deve disparar um e-mail real via Resend', async () => {
    const result = await service.sendVerificationCode(
      'teste@seuemail.com',
      '123456',
    );

    expect(result).toBeDefined();
    console.log('ID do e-mail enviado:', result);
  });
});
