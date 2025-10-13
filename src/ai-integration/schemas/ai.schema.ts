import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AiInteraction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  actionType: string; // 'explain' | 'generate' | 'evaluate'

  @Prop({ type: Object })
  requestData: Record<string, any>;

  @Prop({ type: Object })
  responseData: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AiInteractionSchema = SchemaFactory.createForClass(AiInteraction);
