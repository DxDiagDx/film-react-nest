import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../../films/entities/film.entity';
import { Schedule } from '../../films/entities/schedule.entity';
import { FilmDto } from '../../films/dto/films.dto';
import { IFilmsRepository } from './films-repository.interface';

@Injectable()
export class TypeormFilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({
      relations: ['schedules'],
      order: {
        title: 'ASC',
      },
    });
    return films.map((film) => this.mapFilmToDto(film));
  }

  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });
    return film ? this.mapFilmToDto(film) : null;
  }

  async findScheduleByFilmId(filmId: string): Promise<FilmDto | null> {
    const film = await this.filmRepository.findOne({
      where: { id: filmId },
      relations: ['schedules'],
    });
    return film ? this.mapFilmToDto(film) : null;
  }

  async updateTakenSeats(
    filmId: string,
    scheduleId: string,
    takenSeats: string[],
  ): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId, film: { id: filmId } },
    });

    if (!schedule) {
      throw new Error(`Schedule ${scheduleId} not found for film ${filmId}`);
    }

    // Добавляем новые места к существующим (исключая дубликаты)
    const updatedTaken = [...new Set([...schedule.taken, ...takenSeats])];

    schedule.taken = updatedTaken;
    await this.scheduleRepository.save(schedule);
  }

  private mapFilmToDto(film: Film): FilmDto {
    return {
      id: film.id,
      title: film.title,
      director: film.director,
      rating: film.rating,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      about: film.about,
      description: film.description,
      schedule: film.schedules.map((schedule) => ({
        id: schedule.id,
        daytime: schedule.daytime,
        hall: schedule.hall,
        rows: schedule.rows,
        seats: schedule.seats,
        price: schedule.price,
        taken: schedule.taken || [],
      })),
    };
  }
}
