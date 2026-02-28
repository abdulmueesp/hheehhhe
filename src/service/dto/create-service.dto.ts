import {
    IsString,
    IsBoolean,
    IsOptional,
    IsArray,
    IsNumber,
    IsNotEmpty
} from 'class-validator';

export class CreateServiceDto {
    @IsOptional()
    @IsString()
    serviceName?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsNumber()
    category?: number;

    @IsOptional()
    @IsNumber()
    subcategory?: number;

    @IsOptional()
    @IsNumber()
    town?: number;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    whatsappNumber?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;

    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsBoolean()
    verified?: boolean;

    @IsOptional()
    @IsBoolean()
    is24Hour?: boolean;

    @IsOptional()
    @IsString()
    openingTime?: string;

    @IsOptional()
    @IsString()
    closingTime?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    leaveDays?: string[];

    @IsOptional()
    @IsString()
    instagramLink?: string;

    @IsOptional()
    @IsString()
    website?: string;

    @IsOptional()
    @IsArray()
    serviceItems?: any[];

    @IsOptional()
    @IsString()
    seoTitle?: string;

    @IsOptional()
    @IsString()
    seoDescription?: string;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    galleryImages?: string[];
}
