import { TestingModule, Test } from '@nestjs/testing'
import { Room } from '@prisma/client'
import { PaginationArgs } from 'src/common/dto/pagination-args.dto'
import { CacheService } from 'src/common/services/cache.service'
import { PrismaService } from 'src/common/services/prisma.service'
import { PaginateResponse } from 'src/common/types/paginate-response.type'
import { CreateRoomDto } from './dto/create-room.dto'
import { RoomsService } from './rooms.service'

describe('RoomsService', () => {
  let roomsService: RoomsService
  let prismaService: PrismaService

  let cachedMock: jest.Mock
  let paginateMock: jest.Mock

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    cachedMock = jest.fn(({ fn }) => fn())
    paginateMock = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: PrismaService,
          useValue: {
            room: {
              create: jest.fn()
            },
            paginate: paginateMock
          }
        },
        {
          provide: CacheService,
          useValue: {
            cached: cachedMock
          }
        }
      ]
    }).compile()

    roomsService = module.get<RoomsService>(RoomsService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  describe('create', () => {
    it('should create a room and return the result', async () => {
      const param: CreateRoomDto = { name: 'Sala 1', cinemaId: 1, seatColumns: 10, seatRows: 10 }
      const expected: Room = { id: 1, ...param }
      const createSpy = jest.spyOn(prismaService.room, 'create').mockResolvedValue(expected)
      const result = await roomsService.create(param)

      expect(createSpy).toHaveBeenCalledWith({ param })
      expect(result).toEqual(expected)
    })
  })

  describe('getAll', () => {
    it('should return paginated rooms from cache or db', async () => {
      const param: PaginationArgs = { limit: 10, cursor: undefined }
      const expected: PaginateResponse<Room> = {
        data: [{ id: 1, name: 'Sala 1', cinemaId: 1, seatColumns: 10, seatRows: 10 }],
        nextCursor: '2'
      }

      paginateMock.mockResolvedValue(expected)

      const result = await roomsService.getAll(param)

      expect(cachedMock).toHaveBeenCalledWith({
        key: expect.any(String),
        ttl: '1d',
        fn: expect.any(Function)
      })

      expect(paginateMock).toHaveBeenCalledWith({
        model: 'room',
        param
      })

      expect(result).toEqual(expected)
    })
  })
})
