import { Module } from '@nestjs/common';
import { TownService } from './town.service';
import { TownController } from './town.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TownController],
    providers: [TownService],
})
export class TownModule { }
