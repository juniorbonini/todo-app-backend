/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */

import { MailService } from '@/mailservice/service/mail.service';
import { User } from '@/user/schemas/user.schema';
import { UserService } from '@/user/service/user.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('Fluxo de esqueci minha senha (e2e)', () => {
  let authService: AuthService;
  let userService: UserService;
  let mailService: MailService;

  const mockUserModel = {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const mockMailService = {
    sendVerificationCode: jest.fn().mockResolvedValue(undefined),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('fake-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    mailService = module.get<MailService>(MailService);

    jest.clearAllMocks();
  });

  it('deve gerar um código, salvar no banco e disparar o e-mail', async () => {
    const email = 'la.boninijunior@gmail.com';
    const mockUser = {
      _id: { toString: () => 'user-id-123' },
      email,
      resetCode: null,
      resetCodeExpires: null,
    };

    jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser as any);
    jest.spyOn(userService, 'updateResetCode').mockResolvedValue(undefined);

    const result = await authService.forgotPassword(email);

    expect(result.code).toBe('AUTH_CODE_SENT');
    expect(userService.updateResetCode).toHaveBeenCalledWith(
      'user-id-123',
      expect.any(String),
      expect.any(Date),
    );
    expect(mailService.sendVerificationCode).toHaveBeenCalledWith(
      email,
      expect.any(String),
    );
  });

  it('deve retornar sucesso mesmo se e-mail não existir (segurança)', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

    const result = await authService.forgotPassword('naoexiste@email.com');

    expect(result.code).toBe('AUTH_CODE_SENT');
    expect(mailService.sendVerificationCode).not.toHaveBeenCalled();
  });

  it('deve validar um código correto', async () => {
    const email = 'la.boninijunior@gmail.com';
    const code = '123456';

    const mockUser = {
      email,
      resetCode: code,
      resetCodeExpires: new Date(Date.now() + 100000),
    };

    jest
      .spyOn(userService, 'findByEmailOrThrow')
      .mockResolvedValue(mockUser as any);

    const result = await authService.verifyCode(email, code);

    expect(result.code).toBe('AUTH_CODE_VALID');
  });

  it('deve rejeitar um código incorreto', async () => {
    const mockUser = {
      email: 'la.boninijunior@gmail.com',
      resetCode: '123456',
      resetCodeExpires: new Date(Date.now() + 100000),
    };

    jest
      .spyOn(userService, 'findByEmailOrThrow')
      .mockResolvedValue(mockUser as any);

    await expect(
      authService.verifyCode('la.boninijunior@gmail.com', '000000'),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve rejeitar um código expirado', async () => {
    const mockUser = {
      email: 'la.boninijunior@gmail.com',
      resetCode: '123456',
      resetCodeExpires: new Date(Date.now() - 1000),
    };

    jest
      .spyOn(userService, 'findByEmailOrThrow')
      .mockResolvedValue(mockUser as any);

    await expect(
      authService.verifyCode('la.boninijunior@gmail.com', '123456'),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve atualizar a senha do usuário com sucesso e limpar o código de reset', async () => {
    const email = 'la.boninijunior@gmail.com';
    const code = '123456';
    const newPassword = 'NovaSenhaForte123';

    const mockUser = {
      _id: { toString: () => 'user-id-123' },
      email,
      resetCode: code,
      resetCodeExpires: new Date(Date.now() + 100000),
    };

    jest
      .spyOn(userService, 'findByEmailOrThrow')
      .mockResolvedValue(mockUser as any);
    jest.spyOn(userService, 'updatePassword').mockResolvedValue(undefined);
    jest.spyOn(userService, 'updateResetCode').mockResolvedValue(undefined);

    const result = await authService.resetPassword(email, code, newPassword);

    expect(result.code).toBe('AUTH_PASSWORD_RESET');

    expect(userService.updatePassword).toHaveBeenCalledWith(
      'user-id-123',
      expect.any(String),
    );

    expect(userService.updateResetCode).toHaveBeenCalledWith(
      'user-id-123',
      null,
      null,
    );
  });
});
