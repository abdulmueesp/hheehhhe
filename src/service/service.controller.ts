import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.serviceService.create(createServiceDto);
    }
}
