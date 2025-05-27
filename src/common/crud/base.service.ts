import { FindQuery } from '../dtos/find-query.interface';
import { IBaseRepository } from '../interfaces/base-repository.interface';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseService<T> {
  constructor(protected readonly repository: IBaseRepository<T>) {}

  async create(data: any): Promise<T> {
    return this.repository.create(data);
  }

  async find(findQuery: FindQuery<T>): Promise<{ data: T[]; count: number }> {
    let data = await this.repository.find(findQuery);
    const count = await this.repository.count(findQuery);
    return { data, count };
  }

  async findById(id: string): Promise<T> {
    return this.repository.findById(id);
  }

  async count(findQuery: FindQuery<T>): Promise<number> {
    return this.repository.count(findQuery);
  }

  async updateById(id: string, data: DeepPartial<T>): Promise<T> {
    return this.repository.updateById(id, data);
  }

  async updateOne(
    where: FindOptionsWhere<T>,
    data: DeepPartial<T>,
  ): Promise<T> {
    return this.repository.updateOne(where, data);
  }

  async updateMany(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
    returnUpdated = false,
  ): Promise<T[] | { updatedCount: number }> {
    return this.repository.updateMany(where, data, returnUpdated);
  }

  async deleteById(id: string): Promise<T> {
    return this.repository.deleteById(id);
  }

  async deleteOne(where: FindOptionsWhere<T>): Promise<T> {
    return this.repository.deleteOne(where);
  }

  async deleteMany(
    where: FindOptionsWhere<T>,
    returnDeleted = false,
  ): Promise<T[] | { deletedCount: number }> {
    return this.repository.deleteMany(where, returnDeleted);
  }

  async softDelete(
    where: FindOptionsWhere<T>,
    returnDeleted = false,
  ): Promise<T[] | { deletedCount: number }> {
    return this.repository.softDelete(where, returnDeleted);
  }
}
