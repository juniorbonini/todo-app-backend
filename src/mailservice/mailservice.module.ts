import { Module } from '@nestjs/common';
import { MailserviceService } from './mailservice.service';
import { MailserviceController } from './mailservice.controller';

@Module({
  controllers: [MailserviceController],
  providers: [MailserviceService],
})
export class MailserviceModule {}
