import { Repository } from 'typeorm';
import { FindQueryDto } from '../dtos/find-query.dto';
import { IFindQuery } from '../interfaces/find-query.interface';

export abstract class BaseRepository<T> {
  constructor(private readonly baseRepository: Repository<T>) {}

  async create(data: T): Promise<T> {
    const entity = this.baseRepository.create(data);
    return this.baseRepository.save(entity);
  }

  async find(findQuery: IFindQuery<T>): Promise<T[]> {
    const { page, limit, search, relations, order } = findQuery;

    const entities = this.baseRepository.find({
      where: search,
      relations,
      order,
      skip: page * limit,
      take: limit,
    });
    return entities;
  }

  async findById(id: string): Promise<T> {
    const entity = this.baseRepository.findOneBy({ id });
    return;
  }

  async updateById(id: string, data: Partial<T>): Promise<T> {
    return;
  }

  async updateOne(condition: Partial<T>, data: Partial<T>): Promise<T> {
    return;
  }

  async updateMany(condition: Partial<T>, data: Partial<T>): Promise<T[]> {
    return;
  }

  async deleteById(id: string): Promise<T> {
    return;
  }

  async deleteOne(condition: Partial<T>): Promise<T> {
    return;
  }

  async deleteMany(condition: Partial<T>): Promise<T[]> {
    return;
  }

  async count(findQuery: IFindQuery<T>): Promise<number> {
    const { search } = findQuery;
    return this.baseRepository.count({ where: search });
  }
}
