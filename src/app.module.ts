import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TownModule } from './town/town.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TownModule, AuthModule, CategoryModule, SubcategoryModule, CloudinaryModule, ServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
