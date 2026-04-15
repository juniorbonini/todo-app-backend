import { Module } from '@nestjs/common';

import { JwtStrategy } from '@/jwt/jwt.strategy';
import { MailService } from '@/mailservice/service/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { IsDeliverableEmailValidator } from './validators/is-deliverable-email.validator';

export const JWT_SECRET = 'jwt-secret-key';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    IsDeliverableEmailValidator,
    MailService,
  ],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
