import { Injectable } from '@nestjs/common';
import { FilmDto } from '../../films/dto/films.dto';
import { IFilmsRepository } from './films-repository.interface';

@Injectable()
export class InMemoryFilmsRepository implements IFilmsRepository {
  private films: FilmDto[] = [];

  async findAll(): Promise<FilmDto[]> {
    return this.films;
  }

  async findById(id: string): Promise<FilmDto | null> {
    return this.films.find((film) => film.id === id) || null;
  }

  async findScheduleByFilmId(filmId: string): Promise<FilmDto | null> {
    return this.films.find((film) => film.id === filmId) || null;
  }

  async updateTakenSeats(
    filmId: string,
    scheduleId: string,
    takenSeats: string[],
  ): Promise<void> {
    const film = this.films.find((f) => f.id === filmId);
    if (!film) return;

    const schedule = film.schedule.find((s) => s.id === scheduleId);
    if (!schedule) return;

    // Добавляем места в занятые (исключая дубликаты)
    takenSeats.forEach((seat) => {
      if (!schedule.taken.includes(seat)) {
        schedule.taken.push(seat);
      }
    });
  }

  async seedData(films: FilmDto[]): Promise<void> {
    this.films = films;
  }
}
