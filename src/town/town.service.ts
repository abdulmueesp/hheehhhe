import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTownDto } from './dto/create-town.dto';
import { UpdateTownDto } from './dto/update-town.dto';

@Injectable()
export class TownService {
    constructor(private prisma: PrismaService) { }

    async create(createTownDto: CreateTownDto) {
        try {
            const newTown = await this.prisma.town.create({
                data: {
                    name: createTownDto.name,
                },
            });
            return {
                message: 'Successfully created',
                data: newTown,
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Town with this name already exists');
            }
            throw error;
        }
    }

    async findAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.town.findMany({
                skip,
                take: limit,
                orderBy: { name: 'asc' }, // Optional: order by name
            }),
            this.prisma.town.count(),
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

    async update(id: number, updateTownDto: UpdateTownDto) {
        try {
            const updatedTown = await this.prisma.town.update({
                where: { id },
                data: {
                    name: updateTownDto.name,
                },
            });
            return {
                message: 'Successfully updated',
                data: updatedTown,
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Town with this name already exists');
            }
            if (error.code === 'P2025') {
                // Prisma error for record not found
                throw new ConflictException('Town not found');
            }
            throw error;
        }
    }

    async remove(id: number) {
        try {
            await this.prisma.town.delete({
                where: { id },
            });
            return {
                message: 'Successfully deleted',
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new ConflictException('Town not found');
            }
            throw error;
        }
    }
}
