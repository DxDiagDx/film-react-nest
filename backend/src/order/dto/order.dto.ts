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

export class OrderResponseDto {
  total: number;
  items: TicketDto[];
}

export class PlaceDto {
  row: number;
  seat: number;
}
