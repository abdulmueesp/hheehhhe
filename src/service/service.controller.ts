import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
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
}
