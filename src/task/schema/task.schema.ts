import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskPriority = 'low' | 'medium' | 'high';

export const xpTaskByPriority: Record<TaskPriority, number> = {
  low: 10,
  medium: 15,
  high: 25,
};

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop()
  description: string;

  @Prop({ enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: TaskPriority;

  @Prop({ type: Date, default: null })
  completedAt: Date | null;

  @Prop({ required: true, min: 1 })
  timeLimit: number;

  @Prop({ type: Number, default: null })
  xpEarned: number | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);
