import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FindQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string[];

  @IsOptional()
  @IsString()
  sort?: string[];

  @IsOptional()
  @IsString()
  relations?: string[];

}
