import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { ApiParam, ApiResponse } from '@nestjs/swagger'

@Controller('categories')
export class CategoriesController {
  constructor (private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiResponse({ description: 'Returns the category created' })
  async create (@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto)
  }

  @Get()
  @ApiResponse({ description: 'Returns an array of categories' })
  getAll () {
    return this.categoriesService.getAll()
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Id of the category to get',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({
    status: 200,
    description: 'Returns the category with the id given',
  })
  async getById (@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getById(id)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Id of the category to update',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({
    status: 200,
    description: 'Returns the category updated',
  })
  async update (
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Id of the category to delete',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({
    status: 200,
    description: 'Returns the category deleted',
  })
  async delete (@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.delete(id)
  }
}
