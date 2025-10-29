import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { CreateOrderDto, OrderResponseDto } from '../dto/order.dto';

// Мок для uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234'),
}));

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  const mockOrderService = {
    bookTickets: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    const mockCreateOrderDto: CreateOrderDto = {
      email: 'test@example.com',
      phone: '+79991234567',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '18:00',
          row: 3,
          seat: 5,
          price: 500,
        },
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '18:00',
          row: 3,
          seat: 6,
          price: 500,
        },
      ],
    };

    const mockOrderResponse: OrderResponseDto = {
      total: 2,
      items: [
        {
          id: 'urn:uuid:mock-uuid-1234',
          film: 'film-1',
          session: 'session-1',
          daytime: '18:00',
          row: 3,
          seat: 5,
          price: 500,
        },
        {
          id: 'urn:uuid:mock-uuid-1234',
          film: 'film-1',
          session: 'session-1',
          daytime: '18:00',
          row: 3,
          seat: 6,
          price: 500,
        },
      ],
    };

    it('должен успешно создать заказ', async () => {
      // Arrange
      mockOrderService.bookTickets.mockResolvedValue(mockOrderResponse);

      // Act
      const result = await orderController.createOrder(mockCreateOrderDto);

      // Assert
      expect(orderService.bookTickets).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(result).toEqual(mockOrderResponse);
      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    it('должен вызвать orderService', async () => {
      // Arrange
      mockOrderService.bookTickets.mockResolvedValue(mockOrderResponse);

      // Act
      await orderController.createOrder(mockCreateOrderDto);

      // Assert
      expect(orderService.bookTickets).toHaveBeenCalledTimes(1);
      expect(orderService.bookTickets).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('должен вернуть ответ от orderService', async () => {
      // Arrange
      mockOrderService.bookTickets.mockResolvedValue(mockOrderResponse);

      // Act
      const result = await orderController.createOrder(mockCreateOrderDto);

      // Assert
      expect(result).toBe(mockOrderResponse);
    });

    it('должен обработать пустой массив билетов', async () => {
      // Arrange
      const emptyOrderDto: CreateOrderDto = { 
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [] 
      };
      const emptyResponse: OrderResponseDto = { total: 0, items: [] };
      mockOrderService.bookTickets.mockResolvedValue(emptyResponse);

      // Act
      const result = await orderController.createOrder(emptyOrderDto);

      // Assert
      expect(orderService.bookTickets).toHaveBeenCalledWith(emptyOrderDto);
      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    it('должен вернуть заказ с одним билетом', async () => {
      // Arrange
      const singleTicketDto: CreateOrderDto = {
        email: 'user@example.com',
        phone: '+79998887766',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '20:00',
            row: 1,
            seat: 1,
            price: 700,
          },
        ],
      };

      const singleTicketResponse: OrderResponseDto = {
        total: 1,
        items: [
          {
            id: 'urn:uuid:mock-uuid-1234',
            film: 'film-1',
            session: 'session-1',
            daytime: '20:00',
            row: 1,
            seat: 1,
            price: 700,
          },
        ],
      };

      mockOrderService.bookTickets.mockResolvedValue(singleTicketResponse);

      // Act
      const result = await orderController.createOrder(singleTicketDto);

      // Assert
      expect(orderService.bookTickets).toHaveBeenCalledWith(singleTicketDto);
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].price).toBe(700);
    });
  });
});