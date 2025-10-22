import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}
