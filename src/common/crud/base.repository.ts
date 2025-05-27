import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { FindQueryDto } from '../dtos/find-query-request.dto';
import { FindQuery } from '../dtos/find-query.interface';
import { NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseRepository } from '../interfaces/base-repository.interface';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private readonly baseRepository: Repository<T>) {}

  async create(data: T): Promise<T> {
    const entity = this.baseRepository.create(data);
    return this.baseRepository.save(entity);
  }

  async find(findQuery: FindQuery<T>): Promise<T[]> {
    const { page, limit, search, relations, order, select } = findQuery;

    const entities = this.baseRepository.find({
      where: search,
      relations,
      order,
      select,
      skip: page * limit,
      take: limit,
    });
    return entities;
  }

  async findById(id: string): Promise<T> {
    const entity = this.baseRepository.findOneBy({ id } as any);
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async updateById(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.baseRepository.findOneBy({ id } as any);
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    const updatedEntity = this.baseRepository.merge(entity, data);
    return updatedEntity;
  }

  async updateOne(
    where: FindOptionsWhere<T>,
    data: DeepPartial<T>,
  ): Promise<T> {
    const entity = await this.baseRepository.findOneBy(where);
    const updatedEntity = this.baseRepository.merge(entity, data);
    return updatedEntity;
  }

  async updateMany(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
    returnUpdated: boolean = false,
  ): Promise<T[] | { updatedCount: number }> {
    const entities = await this.baseRepository.update(where, data);
    if (returnUpdated) {
      const updated = await this.baseRepository.find({ where });
      return updated;
    }
    return { updatedCount: entities.affected ?? 0 };
  }

  async deleteById(id: string): Promise<T> {
    const entity = await this.baseRepository.findOneBy({ id } as any);
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    this.baseRepository.remove(entity);
    return entity;
  }

  async deleteOne(where: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.baseRepository.findOneBy(where);
    if (!entity) {
      throw new NotFoundException(`Entity not found`);
    }
    this.baseRepository.remove(entity);
    return;
  }

  async deleteMany(
    where: FindOptionsWhere<T>,
    returnDeleted: boolean = false,
  ): Promise<T[] | { deletedCount: number }> {
    const entities = await this.baseRepository.find({ where });
    if (returnDeleted) {
      await this.baseRepository.remove(entities);
      return entities;
    }
    return { deletedCount: entities.length };
  }

  async softDelete(
    where: FindOptionsWhere<T>,
    returnDeleted: boolean = false,
  ): Promise<T[] | { deletedCount: number }> {
    const entities = await this.baseRepository.find({ where });
    if (returnDeleted) {
      await this.baseRepository.softRemove(entities);
      return entities;
    }
    return { deletedCount: entities.length };
  }

  async count(findQuery: FindQuery<T>): Promise<number> {
    const { search } = findQuery;
    return this.baseRepository.count({ where: search });
  }
}
