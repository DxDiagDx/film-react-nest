import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateOrderDto,
  OrderResponseDto,
  PlaceDto,
  TicketDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Film') private readonly filmModel: Model<any>) {}

  async bookTickets(bookDto: CreateOrderDto): Promise<OrderResponseDto> {
    if (!bookDto.tickets || bookDto.tickets.length === 0) {
      throw new BadRequestException('Нет билетов для бронирования');
    }

    // Берем данные из первого билета (все билеты должны быть на один фильм и сеанс)
    const firstTicket = bookDto.tickets[0];
    const filmId = firstTicket.film;
    const sessionId = firstTicket.session;

    // 1. Найти фильм по filmId
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    // 2. Найти сеанс по sessionId
    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      throw new NotFoundException('Сеанс не найден');
    }

    // 3. Преобразуем tickets в places для проверки
    const places = bookDto.tickets.map((ticket) => ({
      row: ticket.row,
      seat: ticket.seat,
    }));

    // 4. Проверить доступность мест
    this.checkAvailability(session, places);

    // 5. Забронировать места
    const formattedPlaces = this.formatPlaces(places);

    // 6. Обновить документ в MongoDB
    await this.filmModel.updateOne(
      {
        _id: film._id,
        'schedule.id': sessionId,
      },
      {
        $push: {
          'schedule.$.taken': { $each: formattedPlaces },
        },
      },
    );

    // 7. Сформировать ответ
    return this.formatResponse(bookDto.tickets);
  }

  private formatResponse(tickets: TicketDto[]): OrderResponseDto {
    const items = tickets.map((ticket) => ({
      film: ticket.film,
      session: ticket.session,
      daytime: ticket.daytime,
      row: ticket.row,
      seat: ticket.seat,
      price: ticket.price,
      id: uuidv4(),
    }));

    return {
      total: items.length,
      items,
    };
  }

  private checkAvailability(session: any, places: PlaceDto[]): void {
    for (const place of places) {
      // Проверка зала
      if (
        place.row > session.rows ||
        place.seat > session.seats ||
        place.row < 1 ||
        place.seat < 1
      ) {
        throw new BadRequestException(
          `Место ${place.row}:${place.seat} вне зала`,
        );
      }

      // Проверка занятости
      const placeStr = `${place.row}:${place.seat}`;
      if (session.taken.includes(placeStr)) {
        throw new BadRequestException(
          `Место ${place.row}:${place.seat} уже занято`,
        );
      }
    }
  }

  private formatPlaces(places: PlaceDto[]): string[] {
    return places.map((place) => `${place.row}:${place.seat}`);
  }
}
