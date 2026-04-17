import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailserviceController } from './controller/mail.controller';
import { MailService } from './service/mail.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' })],
  controllers: [MailserviceController],
  providers: [MailService],
  exports: [MailService],
})
export class MailserviceModule {}
