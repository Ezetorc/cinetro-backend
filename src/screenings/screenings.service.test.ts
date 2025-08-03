import { TestingModule, Test } from '@nestjs/testing'
import { PaginationDto } from 'src/common/dto/pagination-args.dto'
import { CacheService } from 'src/common/services/cache.service'
import { PrismaService } from 'src/common/services/prisma.service'
import { PaginateResponse } from 'src/common/types/paginate-response.type'
import { ScreeningsService } from './screenings.service'
import { CreateScreeningDto } from './dto/create-screening.dto'
import { Format, Screening } from '@prisma/client'

describe('ScreeningsService', () => {
  let screeningsService: ScreeningsService
  let prismaService: PrismaService

  let cachedMock: jest.Mock
  let paginateMock: jest.Mock

  beforeEach(async () => {
    cachedMock = jest.fn(({ fn }) => fn())
    paginateMock = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScreeningsService,
        {
          provide: PrismaService,
          useValue: {
            screening: {
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

    screeningsService = module.get<ScreeningsService>(ScreeningsService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  describe('create', () => {
    it('should create a screening and return the result', async () => {
      const dto: CreateScreeningDto = {
        format: 'THREE_D',
        movieId: 1,
        roomId: 1,
        startTime: '2025-07-22T21:00:00Z'
      }
      const expected: Screening = { id: 1, ...dto, startTime: new Date('2025-07-22T21:00:00Z') }
      const createSpy = jest.spyOn(prismaService.screening, 'create').mockResolvedValue(expected)
      const result = await screeningsService.create(dto)

      expect(createSpy).toHaveBeenCalledWith({ data: dto })
      expect(result).toEqual(expected)
    })
  })

  describe('getAll', () => {
    it('should return paginated screenings from cache or db', async () => {
      const dto: PaginationDto = { limit: 10, cursor: undefined }
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
      paginateMock.mockResolvedValue(expected)

      const result = await screeningsService.getAll(dto)

      expect(cachedMock).toHaveBeenCalledWith({
        key: expect.any(String),
        ttl: '1h',
        fn: expect.any(Function)
      })
      expect(paginateMock).toHaveBeenCalledWith({ model: 'screening', dto })
      expect(result).toEqual(expected)
    })
  })

  describe('getById', () => {
    it('should return a screening', async () => {
      const id = 1
      const expected: Screening = {
        id,
        format: 'THREE_D',
        movieId: 1,
        roomId: 1,
        startTime: new Date('2025-07-22T21:00:00Z')
      }
      const findUniqueSpy = jest
        .spyOn(prismaService.screening, 'findUnique')
        .mockResolvedValue(expected)
      const result = await screeningsService.getById(id)

      expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id } })
      expect(result).toEqual(expected)
    })
  })

  describe('update', () => {
    it('should update the screening and return the updated screening', async () => {
      const id = 1
      const updateDto = { format: 'TWO_D' as Format }
      const expected: Screening = {
        id,
        format: updateDto.format,
        movieId: 1,
        roomId: 1,
        startTime: new Date('2025-07-22T21:00:00Z')
      }
      const updateSpy = jest.spyOn(prismaService.screening, 'update').mockResolvedValue(expected)
      const result = await screeningsService.update(id, updateDto)

      expect(updateSpy).toHaveBeenCalledWith({ where: { id }, data: updateDto })
      expect(result).toEqual(expected)
    })
  })

  describe('delete', () => {
    it('should delete the screening and return the deleted screening', async () => {
      const id = 1
      const expected: Screening = {
        id,
        format: 'THREE_D',
        movieId: 1,
        roomId: 1,
        startTime: new Date('2025-07-22T21:00:00Z')
      }
      const deleteSpy = jest.spyOn(prismaService.screening, 'delete').mockResolvedValue(expected)
      const result = await screeningsService.delete(id)

      expect(deleteSpy).toHaveBeenCalledWith({ where: { id } })
      expect(result).toEqual(expected)
    })
  })
})
