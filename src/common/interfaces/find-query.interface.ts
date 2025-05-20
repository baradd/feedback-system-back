import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';

export interface IFindQuery<T> {
  page?: number;
  limit?: number;
  search?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  relations?: FindOptionsRelations<T>;
  order?: FindOptionsOrder<T>;
  [key: string]: any;
}
