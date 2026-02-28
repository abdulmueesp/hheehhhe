import { IsBoolean } from 'class-validator';

export class UpdateServiceStatusDto {
    @IsBoolean()
    status: boolean;
}
