import { CreateOrderDto } from '../../order/dto/order.dto';

export interface IOrderRepository {
  create(orderData: CreateOrderDto, pricePerSeat: number): Promise<void>;
}
