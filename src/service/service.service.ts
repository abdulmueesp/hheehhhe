import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { GetServicesFilterDto } from './dto/get-services-filter.dto';

@Injectable()
export class ServiceService {
    constructor(private prisma: PrismaService) { }

    async create(createServiceDto: CreateServiceDto) {
        try {
            // Check if service name exists
            if (createServiceDto.serviceName) {
                const existingService = await this.prisma.service.findUnique({
                    where: { serviceName: createServiceDto.serviceName },
                });

                if (existingService) {
                    throw new ConflictException('Service with this name already exists');
                }
            }

            const {
                serviceItems,
                category,
                subcategory,
                town,
                leaveDays,
                galleryImages,
                ...rest
            } = createServiceDto;

            const service = await this.prisma.service.create({
                data: {
                    ...rest,
                    serviceName: rest.serviceName || 'Untitled Service',
                    categoryId: category,
                    subcategoryId: subcategory,
                    townId: town,
                    serviceItems: serviceItems || [],
                    leaveDays: leaveDays || [],
                    galleryImages: galleryImages || [],
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
    async findOne(id: number) {
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: {
                category: true,
                subcategory: true,
                town: true,
            },
        });

        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }

        return service;
    }

    async update(id: number, updateServiceDto: UpdateServiceDto) {
        try {
            // Check if service exists
            const existingService = await this.findOne(id);

            // Check if name conflict (if name is being updated)
            if (updateServiceDto.serviceName && updateServiceDto.serviceName !== existingService.serviceName) {
                const nameConflict = await this.prisma.service.findUnique({
                    where: { serviceName: updateServiceDto.serviceName },
                });

                if (nameConflict) {
                    throw new ConflictException('Service with this name already exists');
                }
            }

            const {
                category,
                subcategory,
                town,
                ...rest
            } = updateServiceDto;

            const updatedService = await this.prisma.service.update({
                where: { id },
                data: {
                    ...rest,
                    categoryId: category !== undefined ? category : undefined,
                    subcategoryId: subcategory !== undefined ? subcategory : undefined,
                    townId: town !== undefined ? town : undefined,
                },
            });

            return {
                message: 'Service updated successfully',
                data: updatedService,
            };
        } catch (error) {
            console.error('Error updating service:', error);
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            if (error.code === 'P2003') {
                throw new NotFoundException('Related record not found (Town, Category, or Subcategory)');
            }
            throw new InternalServerErrorException('Failed to update service');
        }
    }
    async updateStatus(id: number, status: boolean) {
        try {
            const service = await this.prisma.service.update({
                where: { id },
                data: { status },
            });

            return {
                message: `Service ${status ? 'activated' : 'deactivated'} successfully`,
                data: service,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Service with ID ${id} not found`);
            }
            throw new InternalServerErrorException('Failed to update status');
        }
    }
    async updateVerified(id: number, verified: boolean) {
        try {
            const service = await this.prisma.service.update({
                where: { id },
                data: { verified },
            });

            return {
                message: `Service ${verified ? 'verified' : 'unverified'} successfully`,
                data: service,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Service with ID ${id} not found`);
            }
            throw new InternalServerErrorException('Failed to update verification status');
        }
    }

}
