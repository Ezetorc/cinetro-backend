import { TestingModule, Test } from '@nestjs/testing'
import { Screening } from '@prisma/client'
import { PaginationDto } from 'src/common/dto/pagination-args.dto'
import { PaginateResponse } from 'src/common/types/paginate-response.type'
import { CacheService } from 'src/common/services/cache.service'
import { PrismaService } from 'src/common/services/prisma.service'
import { ScreeningsService } from './screenings.service'
import { ScreeningsController } from './screenings.controller'
import { CreateScreeningDto } from './dto/create-screening.dto'
import { UpdateScreeningDto } from './dto/update-screening.dto'

describe('ScreeningsController', () => {
  let screeningsController: ScreeningsController
  let screeningsService: ScreeningsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreeningsController],
      providers: [
        ScreeningsService,
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

    screeningsController = module.get<ScreeningsController>(ScreeningsController)
    screeningsService = module.get<ScreeningsService>(ScreeningsService)
  })

  describe('create', () => {
    it('should return the created screening', async () => {
      const dto: CreateScreeningDto = {
        format: 'THREE_D',
        movieId: 1,
        roomId: 1,
        startTime: '2025-07-22T21:00:00Z'
      }
      const expected: Screening = { id: 1, ...dto, startTime: new Date(dto.startTime) }
      const createSpy = jest.spyOn(screeningsService, 'create').mockResolvedValue(expected)
      const result = await screeningsController.create(dto)

      expect(createSpy).toHaveBeenCalledWith(dto)
      expect(result).toEqual(expected)
    })
  })

  describe('getAll', () => {
    it('should return paginated screenings', async () => {
      const dto: PaginationDto = { cursor: undefined, limit: undefined }
      const expected: PaginateResponse<Screening> = {
        data: [
          {
            id: 1,
            format: 'THREE_D',
            movieId: 1,
            roomId: 1,
            startTime: new Date('2025-07-22T21:00:00Z')
          }
        ],
        nextCursor: '2'
      }
      const getAllSpy = jest.spyOn(screeningsService, 'getAll').mockResolvedValue(expected)
      const result = await screeningsController.getAll(dto)

      expect(getAllSpy).toHaveBeenCalledWith(dto)
      expect(result).toEqual(expected)
    })

    describe('getById', () => {
      it('should return a screening', async () => {
        const id = 1
        const expected: Screening = {
          id: 1,
          format: 'THREE_D',
          movieId: 1,
          roomId: 1,
          startTime: new Date('2025-07-22T21:00:00Z')
        }
        const getByIdSpy = jest.spyOn(screeningsService, 'getById').mockResolvedValue(expected)
        const result = await screeningsController.getById(id)

        expect(getByIdSpy).toHaveBeenCalledWith(id)
        expect(result).toEqual(expected)
      })
    })

    describe('update', () => {
      it('should return the updated screening', async () => {
        const id = 1
        const dto: UpdateScreeningDto = {
          format: 'THREE_D',
          movieId: 1,
          roomId: 1,
          startTime: '2025-07-22T21:00:00Z'
        }
        const expected: Screening = {
          id: 1,
          format: 'THREE_D',
          movieId: 1,
          roomId: 1,
          startTime: new Date('2025-07-22T21:00:00Z')
        }
        const updateSpy = jest.spyOn(screeningsService, 'update').mockResolvedValue(expected)
        const result = await screeningsController.update(id, dto)

        expect(updateSpy).toHaveBeenCalledWith(id, dto)
        expect(result).toEqual(expected)
      })
    })

    describe('delete', () => {
      it('should return the deleted screening', async () => {
        const id = 1
        const expected: Screening = {
          id: 1,
          format: 'THREE_D',
          movieId: 1,
          roomId: 1,
          startTime: new Date('2025-07-22T21:00:00Z')
        }
        const deleteSpy = jest.spyOn(screeningsService, 'delete').mockResolvedValue(expected)
        const result = await screeningsController.delete(id)

        expect(deleteSpy).toHaveBeenCalledWith(id)
        expect(result).toEqual(expected)
      })
    })
  })
})
