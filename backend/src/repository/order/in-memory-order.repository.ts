import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../../order/dto/order.dto';
import { IOrderRepository } from './order-repository.interface';

@Injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private orders: CreateOrderDto[] = [];

  async create(orderData: CreateOrderDto, pricePerSeat: number): Promise<{ 
    success: boolean; message: string; order?: any 
  }> {
    const order = {
      id: Date.now().toString(),
      ...orderData,
      createdAt: new Date(),
      totalPrice: this.calculateTotalPrice(orderData.seats.length, pricePerSeat),
      pricePerSeat: pricePerSeat,
    }
    
    this.orders.push(order);

    return {
      success: true,
      message: 'Фильм успешно забронирован',
      order
    };
  }

  private calculateTotalPrice(seatsCount: number, pricePerSeat: number): number {
    return seatsCount * pricePerSeat;
  }

  async findAll(): Promise<CreateOrderDto[]> {
    return this.orders;
  }
}