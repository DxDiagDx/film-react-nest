import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { IOrderRepository } from './../repository/order/order-repository.interface';
import { IFilmsRepository } from 'src/repository/films/films-repository.interface';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IFilmsRepository')
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<{ success: boolean; message: string; order?: any }> {
    const { filmId, scheduleId, seats } = createOrderDto;

    // 1. Проверяем существование фильма
    const film = await this.filmsRepository.findById(filmId);
    if (!film) {
      throw new BadRequestException('Фильм не найден');
    }

    // 2. Находим сеанс
    const schedule = film.schedule.find((s) => s.id === scheduleId);
    if (!schedule) {
      throw new BadRequestException('Расписание не найдено');
    }

    // 3. Получаем цену из сеанса
    const pricePerSeat = schedule.price;

    // 4. Валидируем формат мест
    this.validateSeatsFormat(seats);

    // 5. Проверяем, что такие места вообще существуют в зале
    this.validateSeatsExistence(seats, schedule.rows, schedule.seats);

    // 6. Проверяем, что места не заняты
    const conflictingSeats = this.findConflictingSeats(seats, schedule.taken);
    if (conflictingSeats.length > 0) {
      throw new BadRequestException(
        `Места ${conflictingSeats.join(', ')} уже заняты`,
      );
    }

    // 7. Обновляем занятые места в фильме
    await (this.filmsRepository as any).updateTakenSeats?.(
      filmId,
      scheduleId,
      seats,
    );

    // 8. Создаем заказ
    return this.orderRepository.create(createOrderDto, pricePerSeat);
  }

  private validateSeatsFormat(seats: string[]): void {
    const invalidSeats = seats.filter((seat) => !/^\d+:\d+$/.test(seat));
    if (invalidSeats.length > 0) {
      throw new BadRequestException(
        `Неверный формат места: ${invalidSeats.join(', ')}. Используйте формат: "row:seat"`,
      );
    }
  }

  private validateSeatsExistence(
    seats: string[],
    maxRows: number,
    maxSeats: number,
  ): void {
    const invalidSeats: string[] = [];

    seats.forEach((seat) => {
      const [rowStr, seatStr] = seat.split(':');
      const row = parseInt(rowStr);
      const seatNum = parseInt(seatStr);

      if (row > maxRows || row < 1) {
        invalidSeats.push(seat);
      }

      if (seatNum > maxSeats || seatNum < 1) {
        invalidSeats.push(seat);
      }

      if (invalidSeats.length > 0) {
        throw new BadRequestException(
          `Такого места не существует: ${invalidSeats.join(', ')}`,
        );
      }
    });
  }

  private findConflictingSeats(
    requestedSeats: string[],
    takenSeats: string[],
  ): string[] {
    return requestedSeats.filter((seat) => takenSeats.includes(seat));
  }
}
