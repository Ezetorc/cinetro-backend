import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { ApiDescription } from '../common/decorators/api-description.decorator'
import { ApiId } from '../common/decorators/api-id.decorator'
import { Id } from '../common/decorators/id.decorator'

@Controller('categories')
export class CategoriesController {
  constructor (private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiDescription('Returns the category created', HttpStatus.CREATED)
  create (@Body() createDto: CreateCategoryDto) {
    return this.categoriesService.create(createDto)
  }

  @Get()
  @ApiDescription('Returns an array of categories')
  getAll () {
    return this.categoriesService.getAll()
  }

  @Get(':id')
  @ApiId('Id of the category to get')
  @ApiDescription('Category not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the category with the id given', HttpStatus.OK)
  getById (@Id() id: number) {
    return this.categoriesService.getById(id)
  }

  @Patch(':id')
  @ApiId('Id of the category to update')
  @ApiDescription('Category not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the category updated', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiId('Id of the category to delete')
  @ApiDescription('Category not found', HttpStatus.NOT_FOUND)
  @ApiDescription('Returns the category deleted', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.categoriesService.delete(id)
  }
}
