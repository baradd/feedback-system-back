import { FindQuery } from '../dtos/find-query.interface';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseService<T> {
  create(data: T): Promise<T>;

  find(findQuery: FindQuery<T>): Promise<T[]>;
  findById(id: string): Promise<T>;
  count(findQuery: FindQuery<T>): Promise<number>;

  updateById(id: string, data: DeepPartial<T>): Promise<T>;
  updateOne(where: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<T>;
  updateMany(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
    returnUpdated?: boolean,
  ): Promise<T[] | { updatedCount: number }>;

  deleteById(id: string): Promise<T>;
  deleteOne(where: FindOptionsWhere<T>): Promise<T>;
  deleteMany(
    where: FindOptionsWhere<T>,
    returnDeleted?: boolean,
  ): Promise<T[] | { deletedCount: number }>;

  softDelete(
    where: FindOptionsWhere<T>,
    returnDeleted?: boolean,
  ): Promise<T[] | { deletedCount: number }>;
}
