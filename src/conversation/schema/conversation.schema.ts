import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {

  @Prop({ required: true })
  question: string;


  @Prop()
  answer: string;


  @Prop()
  lessonId?: string;


  // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  // userId: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
