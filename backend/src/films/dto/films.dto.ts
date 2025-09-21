//TODO описать DTO для запросов к /films
export class ScheduleDto {
  id: string;
  daytime: Date;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class FilmDto {
  id: string;
  title: string;
  director: string;
  rating: number;
  tags: string[];
  image: string;
  cover: string;
  about: string;
  description: string;
  schedule: ScheduleDto[];
}