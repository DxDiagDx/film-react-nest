import { Injectable } from "@nestjs/common";
import { IFilmsRepository } from "./films-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Film } from "src/films/schemas/film.schema";
import { Model } from "mongoose";
import { FilmDto } from "src/films/dto/films.dto";

@Injectable()
export class MongoFilmsRepository implements IFilmsRepository {
    constructor(
        @InjectModel(Film.name) private readonly filmModel: Model<Film>,
    ) {}

    async findAll(): Promise<FilmDto[]> {
        return this.filmModel.find().exec();
    }

    async findById(id: string): Promise<FilmDto | null> {
        return this.filmModel.findOne({ id }).exec();
    }

    async findScheduleByFilmId(filmId: string): Promise<FilmDto | null> {
        return this.filmModel.findOne({ id: filmId }).exec();
    }

    async updateTakenSeats(filmId: string, scheduleId: string, takenSeats: string[]): Promise<void> {
        await this.filmModel.findOneAndUpdate(
            { 
                id: filmId, 
                'schedule.id': scheduleId 
            },
            { 
                $addToSet: { 
                    'schedule.$.taken': { 
                        $each: takenSeats
                    }
                } 
            }
        ).exec();
    }
}