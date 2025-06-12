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
import { Description } from '../common/decorators/description.decorator'
import { IdParam } from '../common/decorators/id-param.decorator'
import { Id } from '../common/decorators/id.decorator'

@Controller('categories')
export class CategoriesController {
  constructor (private readonly categoriesService: CategoriesService) {}

  @Post()
  @Description('Returns the category created', HttpStatus.CREATED)
  create (@Body() createDto: CreateCategoryDto) {
    return this.categoriesService.create(createDto)
  }

  @Get()
  @Description('Returns an array of categories')
  getAll () {
    return this.categoriesService.getAll()
  }

  @Get(':id')
  @IdParam('Id of the category to get')
  @Description('Category not found', HttpStatus.NOT_FOUND)
  @Description('Returns the category with the id given', HttpStatus.OK)
  getById (@Id() id: number) {
    return this.categoriesService.getById(id)
  }

  @Patch(':id')
  @IdParam('Id of the category to update')
  @Description('Category not found', HttpStatus.NOT_FOUND)
  @Description('Returns the category updated', HttpStatus.OK)
  update (@Id() id: number, @Body() updateDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateDto)
  }

  @Delete(':id')
  @IdParam('Id of the category to delete')
  @Description('Category not found', HttpStatus.NOT_FOUND)
  @Description('Returns the category deleted', HttpStatus.OK)
  delete (@Id() id: number) {
    return this.categoriesService.delete(id)
  }
}
