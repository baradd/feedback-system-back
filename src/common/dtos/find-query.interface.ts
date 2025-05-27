import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

export class FindQuery<T> {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  search?: FindOptionsWhere<T> | FindOptionsWhere<T>[];

  @IsOptional()
  relations?: FindOptionsRelations<T>;

  @IsOptional()
  select?: FindOptionsSelect<T>;

  @IsOptional()
  order?: FindOptionsOrder<T>;
}
