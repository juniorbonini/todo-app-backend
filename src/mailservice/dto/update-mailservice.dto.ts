import { PartialType } from '@nestjs/mapped-types';
import { CreateMailserviceDto } from './create-mailservice.dto';

export class UpdateMailserviceDto extends PartialType(CreateMailserviceDto) {}
