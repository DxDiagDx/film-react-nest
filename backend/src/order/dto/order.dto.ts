//TODO реализовать DTO для /orders
export class CreateOrderDto {
  filmId: string;
  scheduleId: string;
  seats: string[];
  userEmail: string;
  userName: string;
}
