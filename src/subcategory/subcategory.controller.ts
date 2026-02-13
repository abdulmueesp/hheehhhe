import { Controller, Post, Body, UseGuards, Get, Query, Patch, Param, Delete } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('subcategory')
export class SubcategoryController {
    constructor(private readonly subcategoryService: SubcategoryService) { }

    @Post()
    create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
        return this.subcategoryService.create(createSubcategoryDto);
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Query('search') search?: string,
    ) {
        return this.subcategoryService.findAll(Number(page), Number(pageSize), search);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
        return this.subcategoryService.update(Number(id), updateSubcategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.subcategoryService.remove(Number(id));
    }

    @Get('category/:categoryId')
    findByCategory(@Param('categoryId') categoryId: string) {
        return this.subcategoryService.findByCategory(Number(categoryId));
    }
}
