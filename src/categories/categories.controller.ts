import { Controller, Get, Post, Body, Delete, HttpStatus, Query } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { ApiDescription } from '../common/decorators/api-description.decorator'
import { UsePolicy } from 'src/policy/decorators/use-policy.decorator'
import { Name } from 'src/common/decorators/name.decorator'
import { ApiName } from 'src/common/decorators/api-name.decorator'
import { ApiPagination } from 'src/common/decorators/api-pagination.decorator'
import { PaginationDto } from 'src/common/dto/pagination-args.dto'

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UsePolicy('create', 'category')
  @ApiDescription('Returns the category created', HttpStatus.CREATED)
  create(@Body() createDto: CreateCategoryDto) {
    return this.categoriesService.create(createDto)
  }

  @Get()
  @UsePolicy('read', 'category:all')
  @ApiDescription('Returns an array of categories')
  @ApiPagination()
  getAll(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.getAll(paginationDto)
  }

  @Get(':id')
  @UsePolicy('read', 'category')
  @ApiName('Name of the category to get')
  @ApiDescription('Category not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the category with the id given', HttpStatus.OK)
  getById(@Name() name: string) {
    return this.categoriesService.getById(name)
  }

  @Delete(':id')
  @UsePolicy('delete', 'category')
  @ApiName('Name of the category to delete')
  @ApiDescription('Category not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the category deleted', HttpStatus.OK)
  delete(@Name() name: string) {
    return this.categoriesService.delete(name)
  }
}
