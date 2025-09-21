//TODO реализовать DTO для /orders
export class CreateOrderDto {
  filmId: string;
  scheduleId: string;
  seats: string[];
  userEmail: string;
  userName: string;
}

export class OrderItemResponseDto {
  film: string;
  session: string;
  daytime: Date;
  row: number;
  seat: number;
  price: number;
  id: string;
}

export class OrderResponseDto {
  total: number;
  items: OrderItemResponseDto[];
}
