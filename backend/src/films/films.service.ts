import { IFilmsRepository } from './../repository/films/films-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { FilmDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
    constructor(
        @Inject('IFilmsRepository')
        private readonly filmsRepository: IFilmsRepository,
    ) {}

    async getAllFilms(): Promise<FilmDto[]> {
        return this.filmsRepository.findAll();
    }

    async getFilmSchedule(id: string): Promise<FilmDto> {
        const film = await this.filmsRepository.findScheduleByFilmId(id);
        if (!film) {
            throw new Error('Фильм не найден');
        }
        return film;
    }
}
