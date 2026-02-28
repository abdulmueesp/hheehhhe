import { IsBoolean } from 'class-validator';

export class UpdateServiceVerifiedDto {
    @IsBoolean()
    verified: boolean;
}
