import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoryService {
    constructor(private prisma: PrismaService) { }

    async create(createSubcategoryDto: CreateSubcategoryDto) {
        try {
            const { categoryId, names } = createSubcategoryDto;

            // Validate category existence
            const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
            if (!category) {
                throw new NotFoundException('Category not found');
            }

            // Bulk create
            const createdSubcategories = await this.prisma.subcategory.createManyAndReturn({
                data: names.map(name => ({
                    name,
                    categoryId,
                })),
            });

            return {
                message: 'Successfully created',
                data: createdSubcategories,
            };
        } catch (error) {
            throw error;
        }
    }

    async findAll(page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        const [data, total] = await Promise.all([
            this.prisma.subcategory.findMany({
                skip,
                take: limit,
                where,
                include: { category: true },
                orderBy: { name: 'asc' },
            }),
            this.prisma.subcategory.count({ where }),
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

    async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
        try {
            const updatedSubcategory = await this.prisma.subcategory.update({
                where: { id },
                data: {
                    name: updateSubcategoryDto.name,
                    categoryId: updateSubcategoryDto.categoryId
                },
            });
            return {
                message: 'Successfully updated',
                data: updatedSubcategory,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Subcategory not found');
            }
            throw error;
        }
    }

    async remove(id: number) {
        try {
            await this.prisma.subcategory.delete({
                where: { id },
            });
            return {
                message: 'Successfully deleted',
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Subcategory not found');
            }
            throw error;
        }

    }

    async findByCategory(categoryId: number) {
        try {
            const subcategories = await this.prisma.subcategory.findMany({
                where: { categoryId },
                orderBy: { name: 'asc' },
            });

            return {
                message: 'Successfully fetched subcategories',
                data: subcategories,
            };
        } catch (error) {
            throw error;
        }
    }
}
