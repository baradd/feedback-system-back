import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

export interface IFindQuery<T> {
  page?: number;
  limit?: number;
  search?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  relations?: FindOptionsRelations<T>;
  select?: FindOptionsSelect<T>;
  order?: FindOptionsOrder<T>;
  [key: string]: any;
}
