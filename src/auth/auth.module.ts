import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from '@/user/user.module';
import { AuthService } from './service/auth.service';
import { MailserviceModule } from '@/mailservice/mail.module';
import { AuthController } from './controller/auth.controller';
import { IsDeliverableEmailValidator } from './validators/is-deliverable-email.validator';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MailserviceModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, IsDeliverableEmailValidator],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
