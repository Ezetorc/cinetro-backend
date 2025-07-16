import { TestingModule, Test } from '@nestjs/testing'
import { Room } from '@prisma/client'
import { PaginationDto } from 'src/common/dto/pagination-args.dto'
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
    cachedMock = jest.fn(({ fn }) => fn())
    paginateMock = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: PrismaService,
          useValue: {
            room: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn()
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
      const dto: CreateRoomDto = { name: 'Sala 1', cinemaId: 1, seatColumns: 10, seatRows: 10 }
      const expected: Room = { id: 1, ...dto }
      const createSpy = jest.spyOn(prismaService.room, 'create').mockResolvedValue(expected)
      const result = await roomsService.create(dto)

      expect(createSpy).toHaveBeenCalledWith({ data: dto })
      expect(result).toEqual(expected)
    })
  })

  describe('getAll', () => {
    it('should return paginated rooms from cache or db', async () => {
      const dto: PaginationDto = { limit: 10, cursor: undefined }
      const expected: PaginateResponse<Room> = {
        data: [{ id: 1, name: 'Sala 1', cinemaId: 1, seatColumns: 10, seatRows: 10 }],
        nextCursor: '2'
      }
      paginateMock.mockResolvedValue(expected)

      const result = await roomsService.getAll(dto)

      expect(cachedMock).toHaveBeenCalledWith({
        key: expect.any(String),
        ttl: '1d',
        fn: expect.any(Function)
      })
      expect(paginateMock).toHaveBeenCalledWith({ model: 'room', dto })
      expect(result).toEqual(expected)
    })
  })

  describe('getById', () => {
    it('should return a room', async () => {
      const id = 1
      const expected = { id, name: 'Sala 1', cinemaId: 1, seatColumns: 10, seatRows: 10 }
      const findUniqueSpy = jest.spyOn(prismaService.room, 'findUnique').mockResolvedValue(expected)
      const result = await roomsService.getById(id)

      expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id } })
      expect(result).toEqual(expected)
    })
  })

  describe('update', () => {
    it('should update the room and return the updated room', async () => {
      const id = 1
      const updateDto = { name: 'Sala Pro' }
      const expected = { id, name: updateDto.name, cinemaId: 1, seatColumns: 10, seatRows: 10 }
      const updateSpy = jest.spyOn(prismaService.room, 'update').mockResolvedValue(expected)
      const result = await roomsService.update(id, updateDto)

      expect(updateSpy).toHaveBeenCalledWith({ where: { id }, data: updateDto })
      expect(result).toEqual(expected)
    })
  })

  describe('delete', () => {
    it('should delete the room and return the deleted room', async () => {
      const id = 1
      const expected = { id, name: 'Sala 1', cinemaId: 1, seatColumns: 10, seatRows: 10 }
      const deleteSpy = jest.spyOn(prismaService.room, 'delete').mockResolvedValue(expected)
      const result = await roomsService.delete(id)

      expect(deleteSpy).toHaveBeenCalledWith({ where: { id } })
      expect(result).toEqual(expected)
    })
  })
})
