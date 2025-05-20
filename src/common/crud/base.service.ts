import { BaseRepository } from './base.repository';

export abstract class BaseService<T> {
  constructor(private readonly baseRepository: BaseRepository<T>) {}
}
