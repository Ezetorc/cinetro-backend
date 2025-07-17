import { TestingModule, Test } from '@nestjs/testing'
import { Room } from '@prisma/client'
import { CreateRoomDto } from './dto/create-room.dto'
import { RoomsService } from './rooms.service'
import { RoomsController } from './rooms.controller'
import { PaginationDto } from 'src/common/dto/pagination-args.dto'
import { PaginateResponse } from 'src/common/types/paginate-response.type'
import { CacheService } from 'src/common/services/cache.service'
import { PrismaService } from 'src/common/services/prisma.service'
import { UpdateRoomDto } from './dto/update-room.dto'

describe('RoomsController', () => {
  let roomsController: RoomsController
  let roomsService: RoomsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
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
            paginate: jest.fn()
          }
        },
        {
          provide: CacheService,
          useValue: {
            cached: jest.fn(({ fn }) => fn())
          }
        }
      ]
    }).compile()

    roomsController = module.get<RoomsController>(RoomsController)
    roomsService = module.get<RoomsService>(RoomsService)
  })

  describe('create', () => {
    it('should return the created room', async () => {
      const dto: CreateRoomDto = { name: 'Sala 1', cinemaId: 1, seatColumns: 10, seatRows: 10 }
      const expected: Room = { id: 1, ...dto }
      const createSpy = jest.spyOn(roomsService, 'create').mockResolvedValue(expected)
      const result = await roomsController.create(dto)

      expect(createSpy).toHaveBeenCalledWith(dto)
      expect(result).toEqual(expected)
    })
  })

  describe('getAll', () => {
    it('should return paginated rooms', async () => {
      const dto: PaginationDto = { cursor: undefined, limit: undefined }
      const expected: PaginateResponse<Room> = {
        data: [{ id: 1, name: 'Sala 1', cinemaId: 1, seatColumns: 10, seatRows: 10 }],
        nextCursor: '2'
      }
      const getAllSpy = jest.spyOn(roomsService, 'getAll').mockResolvedValue(expected)
      const result = await roomsController.getAll(dto)

      expect(getAllSpy).toHaveBeenCalledWith(dto)
      expect(result).toEqual(expected)
    })

    describe('getById', () => {
      it('should return a room', async () => {
        const id = 1
        const expected: Room = { id: 1, name: 'Sala 1', cinemaId: 1, seatColumns: 10, seatRows: 10 }
        const getByIdSpy = jest.spyOn(roomsService, 'getById').mockResolvedValue(expected)
        const result = await roomsController.getById(id)

        expect(getByIdSpy).toHaveBeenCalledWith(id)
        expect(result).toEqual(expected)
      })
    })

    describe('update', () => {
      it('should return the updated room', async () => {
        const id = 1
        const dto: UpdateRoomDto = { name: 'Sala Pro' }
        const expected: Room = { id, name: 'Sala Pro', cinemaId: 1, seatColumns: 10, seatRows: 10 }
        const updateSpy = jest.spyOn(roomsService, 'update').mockResolvedValue(expected)
        const result = await roomsController.update(id, dto)

        expect(updateSpy).toHaveBeenCalledWith(id, dto)
        expect(result).toEqual(expected)
      })
    })

    describe('delete', () => {
      it('should return the deleted room', async () => {
        const id = 1
        const expected: Room = { id, name: 'Sala 1', cinemaId: 1, seatColumns: 10, seatRows: 10 }
        const deleteSpy = jest.spyOn(roomsService, 'delete').mockResolvedValue(expected)
        const result = await roomsController.delete(id)

        expect(deleteSpy).toHaveBeenCalledWith(id)
        expect(result).toEqual(expected)
      })
    })
  })
})
