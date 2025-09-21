import { CreateOrderDto } from "../../order/dto/order.dto";

export interface IOrderRepository {
  create(orderData: CreateOrderDto, pricePerSeat: number): Promise<{ success: boolean; message: string; order?: any }>;
}