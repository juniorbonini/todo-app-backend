import { Module } from '@nestjs/common';
import { MailserviceController } from './controller/mailservice.controller';
import { MailService } from './service/mailservice.service';

@Module({
  controllers: [MailserviceController],
  providers: [MailService],
})
export class MailserviceModule {}
