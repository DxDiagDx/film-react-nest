import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';

import { Film, FilmSchema } from './films/schemas/film.schema';

import { MongoFilmsRepository } from './repository/films/mongo-films.repository';
import { MongoOrderRepository } from './repository/order/mongo-order.repository';
import { Order, OrderSchema } from './order/schemas/order.schema';
import { InMemoryFilmsRepository } from './repository/films/in-memory-films.repository';
import { InMemoryOrderRepository } from './repository/order/in-memory-order.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    // Подключаем MongoDB
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL || 'mongodb://localhost:27017/afisha',
      }),
    }),
    // Регистрируем схему фильма
    MongooseModule.forFeature([
      { name: Film.name, schema: FilmSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    // @todo: Добавьте раздачу статических файлов из public
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    {
      provide: 'IFilmsRepository',
      useClass: MongoFilmsRepository,
    },
    {
      provide: 'IOrderRepository',
      useClass: MongoOrderRepository,
    },
  ],
})
export class AppModule {}
