// mail.service.spec.ts
import { AuthService } from '@/auth/service/auth.service';
import { UserService } from '@/user/service/user.service';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

export class AuthServiceTest {
  constructor(private authService: AuthService) {}
}

describe('MailService (E2E/Integration)', () => {
  let service: MailService;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: '.env' })],
      providers: [MailService, AuthService, UserService, JwtService],
    }).compile();

    service = module.get<MailService>(MailService);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('deve disparar um e-mail real via Resend', async () => {
    const result = await service.sendVerificationCode(
      'la.boninijunior@gmail.com',
      '123456',
    );

    expect(result).toBeDefined();
    console.log('ID do e-mail enviado:', result);
  });

  describe('Fluxo de Esqueci Minha Senha (E2E)', () => {
    it('deve gerar um código, salvar no banco e enviar o e-mail', async () => {
      const email = 'luabonini@gmail.com';

      await authService.generateForgotPasswordCode(email);

      const user = await userService.findByEmail(email);
      expect(user?.resetCode).not.toBeNull();
      expect(user?.resetCode).toHaveLength(6);
    });
  });
});
