import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../films.controller';
import { FilmsService } from '../films.service';
import { FilmDto } from '../dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  const mockFilm: FilmDto = {
    id: 'test-id',
    title: 'Test Film',
    director: 'Test Director',
    rating: 8.5,
    tags: ['Drama'],
    image: '/test.jpg',
    cover: '/test-cover.jpg', 
    about: 'Test about',
    description: 'Test description',
    schedule: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            getAllFilms: jest.fn(),
            getFilmSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  describe('getAllFilms', () => {
    it('должен вернуть список фильмов', async () => {
      const films = [mockFilm];
      jest.spyOn(filmsService, 'getAllFilms').mockResolvedValue(films);

      const result = await controller.getAllFilms();

      expect(result).toEqual({
        total: 1,
        items: films
      });
      expect(filmsService.getAllFilms).toHaveBeenCalled();
    });
  });

  describe('getFilmSchedule', () => {
    it('должен вернуть расписание', async () => {
      const filmWithSchedule = {
        ...mockFilm,
        schedule: [
          {
            id: 'schedule-1',
            daytime: new Date(),
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: []
          }
        ]
      };
      
      jest.spyOn(filmsService, 'getFilmSchedule').mockResolvedValue(filmWithSchedule);

      const result = await controller.getFilmSchedule('test-id');

      expect(result).toEqual({
        total: 1,
        items: filmWithSchedule.schedule
      });
      expect(filmsService.getFilmSchedule).toHaveBeenCalledWith('test-id');
    });
  });
});