import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetServicesFilterDto } from './dto/get-services-filter.dto';

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

    async findAll(filterDto: GetServicesFilterDto) {
        const { active, verified, search, category, subcategory, page = '1', pageSize = '10' } = filterDto;
        const where: any = {};

        if (active !== undefined) {
            where.status = active === 'true';
        }

        if (verified !== undefined) {
            where.verified = verified === 'true';
        }

        if (category) {
            where.categoryId = parseInt(category);
        }

        if (subcategory) {
            where.subcategoryId = parseInt(subcategory);
        }

        if (search) {
            where.OR = [
                { serviceName: { contains: search, mode: 'insensitive' } },
                { phoneNumber: { contains: search, mode: 'insensitive' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const take = parseInt(pageSize);

        const [data, total] = await Promise.all([
            this.prisma.service.findMany({
                where,
                include: {
                    category: true,
                    subcategory: true,
                    town: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
            }),
            this.prisma.service.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                lastPage: Math.ceil(total / parseInt(pageSize)),
            },
        };
    }

}
