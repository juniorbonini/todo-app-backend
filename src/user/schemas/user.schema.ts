import { Document } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const userSchema = SchemaFactory.createForClass(User);
