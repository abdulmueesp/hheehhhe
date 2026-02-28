import { Controller, Post, Body, UseGuards, Get, Query, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UpdateServiceStatusDto } from './dto/update-status.dto';
import { UpdateServiceVerifiedDto } from './dto/update-verified.dto';
import { GetServicesFilterDto } from './dto/get-services-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Post()
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.serviceService.create(createServiceDto);
    }

    @Get()
    findAll(@Query() filterDto: GetServicesFilterDto) {
        return this.serviceService.findAll(filterDto);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.serviceService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateServiceDto: UpdateServiceDto) {
        return this.serviceService.update(id, updateServiceDto);
    }

    @Patch(':id/status')
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateStatusDto: UpdateServiceStatusDto) {
        return this.serviceService.updateStatus(id, updateStatusDto.status);
    }

    @Patch(':id/verified')
    updateVerified(@Param('id', ParseIntPipe) id: number, @Body() updateVerifiedDto: UpdateServiceVerifiedDto) {
        return this.serviceService.updateVerified(id, updateVerifiedDto.verified);
    }
}
