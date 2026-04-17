import { JwtStrategy } from '@/jwt/jwt.strategy';
import { MailserviceModule } from '@/mailservice/mail.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
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
export class AuthMode {}
