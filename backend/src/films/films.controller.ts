import { Controller, Get, Param } from '@nestjs/common';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getAllFilms(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmsService.getAllFilms();
    return {
      total: films.length,
      items: films,
    };
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<{ total: number; items: ScheduleDto[] }> {
    const film = await this.filmsService.getFilmSchedule(id);
    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }
}
