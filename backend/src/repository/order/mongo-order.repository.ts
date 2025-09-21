import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../order/schemas/order.schema';
import { CreateOrderDto } from 'src/order/dto/order.dto';
import { IOrderRepository } from './order-repository.interface';

@Injectable()
export class MongoOrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async create(orderData: CreateOrderDto, pricePerSeat: number): Promise<void> {
    const order = new this.orderModel({
      ...orderData,
      totalPrice: orderData.seats.length * pricePerSeat,
      pricePerSeat,
      createdAt: new Date(),
    });

    await order.save();
  }
}
