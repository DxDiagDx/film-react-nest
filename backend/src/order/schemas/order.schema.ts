import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  filmId: string;

  @Prop({ required: true })
  scheduleId: string;

  @Prop({ type: [String], required: true })
  seats: string[];

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  pricePerSeat: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);