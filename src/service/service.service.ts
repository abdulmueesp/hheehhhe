import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
    constructor(private prisma: PrismaService) { }

    async create(createServiceDto: CreateServiceDto) {
        try {
            // Check if service name exists
            const existingService = await this.prisma.service.findUnique({
                where: { serviceName: createServiceDto.serviceName },
            });

            if (existingService) {
                throw new ConflictException('Service with this name already exists');
            }

            const {
                serviceItems,
                category,
                subcategory,
                town,
                ...rest
            } = createServiceDto;

            const service = await this.prisma.service.create({
                data: {
                    ...rest,
                    categoryId: category,
                    subcategoryId: subcategory,
                    townId: town,
                    serviceItems: serviceItems ? serviceItems : [],
                },
            });

            return {
                message: 'Service created successfully',
                data: service,
            };
        } catch (error) {
            console.error('Error creating service:', error);
            if (error instanceof ConflictException) {
                throw error;
            }
            if (error.code === 'P2003') {
                throw new NotFoundException('Related record not found (Town, Category, or Subcategory)');
            }
            throw new InternalServerErrorException('Failed to create service');
        }
    }
}
