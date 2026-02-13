import { Controller, Post, Body, UseGuards, Get, Query, Patch, Param, Delete } from '@nestjs/common';
import { TownService } from './town.service';
import { CreateTownDto } from './dto/create-town.dto';
import { UpdateTownDto } from './dto/update-town.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('town')
export class TownController {
    constructor(private readonly townService: TownService) { }

    @Post()
    create(@Body() createTownDto: CreateTownDto) {
        return this.townService.create(createTownDto);
    }

    @Get()
    findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
        return this.townService.findAll(Number(page), Number(pageSize));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTownDto: UpdateTownDto) {
        return this.townService.update(Number(id), updateTownDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.townService.remove(Number(id));
    }
}
