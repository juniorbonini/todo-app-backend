/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */

import { MailService } from '@/mailservice/service/mail.service';
import { User } from '@/user/schemas/user.schema';
import { UserService } from '@/user/service/user.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('Fluxo de esqueci minha senha (e2e)', () => {
  let userService: UserService;
  let authService: AuthService;

  const mockUserModel = {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        MailService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('deve gerar um código, salvar no banco e disparar o e-mail', async () => {
    const email = 'la.boninijunior@gmail.com';
    const mockUser = { _id: { toString: () => '123' }, email };

    jest
      .spyOn(userService, 'findByEmailOrThrow')
      .mockResolvedValue(mockUser as any);

    jest
      .spyOn(userService, 'updateResetCode')
      .mockResolvedValue(mockUser as any);

    const result = await authService.generateForgotPasswordCode(email);

    expect(result.code).toBe('AUTH_CODE_SENT');
    expect(userService.updateResetCode).toHaveBeenCalled();
  });

  it('deve validar um código correto e rejeitar um código incorreto', async () => {
    const email = 'la.boninijunior@gmail.com';
    const correctCode = '123456';

    const mockUser = {
      email,
      resetCode: correctCode,
      resetCodeExpires: new Date(Date.now() * 100000),
    };

    jest
      .spyOn(userService, 'findByEmailOrThrow')
      .mockResolvedValue(mockUser as any);

    const validResult = await authService.verifyCode(email, correctCode);
    expect(validResult.code).toBe('AUTH_CODE_VALID');

    await expect(authService.verifyCode(email, '000000')).rejects.toThrow();
  });
});
