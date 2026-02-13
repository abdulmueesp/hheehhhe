import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        try {
            const newCategory = await this.prisma.category.create({
                data: {
                    name: createCategoryDto.name,
                },
            });
            return {
                message: 'Successfully created',
                data: newCategory,
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Category with this name already exists');
            }
            throw error;
        }
    }

    async findAll(page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit;

        const where = search ? {
            name: {
                contains: search,
                mode: 'insensitive' as const,
            }
        } : {};

        const [data, total] = await Promise.all([
            this.prisma.category.findMany({
                skip,
                take: limit,
                where,
                orderBy: { name: 'asc' },
            }),
            this.prisma.category.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
                limit
            }
        };
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        try {
            const updatedCategory = await this.prisma.category.update({
                where: { id },
                data: {
                    name: updateCategoryDto.name,
                },
            });
            return {
                message: 'Successfully updated',
                data: updatedCategory,
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Category with this name already exists');
            }
            if (error.code === 'P2025') {
                throw new ConflictException('Category not found');
            }
            throw error;
        }
    }

    async remove(id: number) {
        try {
            await this.prisma.category.delete({
                where: { id },
            });
            return {
                message: 'Successfully deleted',
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new ConflictException('Category not found');
            }
            throw error;
        }
    }
}
