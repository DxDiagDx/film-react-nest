//TODO реализовать DTO для /orders
export class TicketDto {
  film: string; // filmId
  session: string; // sessionId
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}

export class OrderItemDto {
  id: string;
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class OrderResponseDto {
  total: number;
  items: OrderItemDto[];
}

export class PlaceDto {
  row: number;
  seat: number;
}
