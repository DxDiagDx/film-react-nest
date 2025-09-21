import { FilmDto } from "../../films/dto/films.dto";

export interface IFilmsRepository {
    findAll(): Promise<FilmDto[]>;
    findById(id: string): Promise<FilmDto | null>;
    findScheduleByFilmId(filmId: string): Promise<FilmDto | null>;
    updateTakenSeats(filmId: string, scheduleId: string, takenSeats: string[]): Promise<void>;
}