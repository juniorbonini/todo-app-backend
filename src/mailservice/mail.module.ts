import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MailService } from './service/mail.service';
import { MailserviceController } from './controller/mail.controller';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' })],
  controllers: [MailserviceController],
  providers: [MailService],
  exports: [MailService],
})
export class MailserviceModule {}
