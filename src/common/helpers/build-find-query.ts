import { BadRequestException } from '@nestjs/common';
import { FindQueryDto } from '../dtos/find-query-request.dto';
import { FindQuery } from '../dtos/find-query.interface';
import { IValidParams } from '../interfaces/valid-query-params.interface';
import {
  Between,
  FindOperator,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

type NestedObject = Record<string, any>;

// valid filter rules
export enum FilterOperators {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
  BETWEEN = 'between',
}

export interface Filtering {
  property: string;
  rule: string;
  value: string;
}

export interface Sorting {
  property: string;
  direction: string;
}

export default function buildFindQuery<T>(
  queryDto: FindQueryDto,
  validParams: IValidParams,
): FindQuery<T> {
  let { search, sort, relations, select } = queryDto;

  const {
    filters: validFilterParams,
    sort: validSortParams,
    relations: validRelations,
  } = validParams;
  let parsedQueryFilter: FindQuery<T> = {
    page: 0,
    limit: 0,
  };
  if (search) {
    // check if the valid params sent is an array
    if (typeof validFilterParams != 'object')
      throw new BadRequestException('Invalid search parameters');

    if (!Array.isArray(search)) search = [search];

    // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
    const result = search.every((f) => {
      return (
        f.match(
          /^[a-zA-Z0-9\u06F0-\u06F9._]+::(eq|neq|gt|gte|lt|lte|like|nlike|in|nin|between)::[a-zA-Zآ-ی0-9\u06F0-\u06F9_: ,-/)()]+$/,
        ) || f.match(/^[a-zA-Z0-9_]+::(isnull|isnotnull)$/)
      );
    });

    if (!result) throw new BadRequestException('Invalid filter parameter');

    const filterData = [];
    search.forEach((f) => {
      const [property, rule, value] = f.split('::');

      if (
        !validFilterParams.includes(property) &&
        validFilterParams.length !== 0
      )
        throw new BadRequestException(`Invalid filter property: ${property}`);
      if (!Object.values(FilterOperators).includes(rule as FilterOperators))
        throw new BadRequestException(`Invalid filter rule: ${rule}`);
      filterData.push({ property, rule, value });
    });
    parsedQueryFilter.search = generateWhere(filterData);
  }

  if (sort) {
    // check if the valid params sent is an array

    if (typeof validSortParams != 'object')
      throw new BadRequestException('Invalid sort parameters');

    // check the format of the sort query param
    const sortPattern = /^([a-zA-Z0-9]+)::(asc|desc)$/;
    if (!sort.match(sortPattern))
      throw new BadRequestException('Invalid sort parameter');

    // extract the property name and direction and check if they are valid
    const [property, direction] = sort.split('::');

    if (!validSortParams.includes(property) && validFilterParams.length > 0)
      throw new BadRequestException(`Invalid sort property: ${property}`);

    parsedQueryFilter.order = getOrder({ property, direction });
  }
  if (relations) {
    const relationKeys = relations.split(',');
    // check if the valid params sent is an array
    if (typeof validRelations != 'object')
      throw new BadRequestException('Invalid relations parameters');

    // check if the relations are valid
    relationKeys.forEach((relation) => {
      if (!validRelations.includes(relation) && validRelations.length > 0)
        throw new BadRequestException(`Invalid relation: ${relation}`);
    });

    parsedQueryFilter.relations = getRelations(relationKeys);
  }

  if (select) {
    const selectKeys = select.split(',');
    parsedQueryFilter.select = getSelect(selectKeys);
  }
  parsedQueryFilter.page = queryDto.page;
  parsedQueryFilter.limit = queryDto.limit;
  return parsedQueryFilter;
}

export const generateWhere = (filters: Filtering[]) => {
  return filters.reduce((acc, f) => {
    if (!f) return acc;

    let condition: Record<string, any> = {};
    switch (f.rule) {
      case FilterOperators.IS_NULL:
        condition = { [f.property]: IsNull() };
        break;
      case FilterOperators.IS_NOT_NULL:
        condition = { [f.property]: Not(IsNull()) };
        break;
      case FilterOperators.EQUALS:
        condition = { [f.property]: f.value };
        break;
      case FilterOperators.NOT_EQUALS:
        condition = { [f.property]: Not(f.value) };
        break;
      case FilterOperators.GREATER_THAN:
        condition = { [f.property]: MoreThan(f.value) };
        break;
      case FilterOperators.GREATER_THAN_OR_EQUALS:
        condition = { [f.property]: MoreThanOrEqual(f.value) };
        break;
      case FilterOperators.LESS_THAN:
        condition = { [f.property]: LessThan(f.value) };
        break;
      case FilterOperators.LESS_THAN_OR_EQUALS:
        condition = { [f.property]: LessThanOrEqual(f.value) };
        break;
      case FilterOperators.LIKE:
        condition = { [f.property]: ILike(`%${f.value}%`) };
        break;
      case FilterOperators.NOT_LIKE:
        condition = { [f.property]: Not(ILike(`%${f.value}%`)) };
        break;
      case FilterOperators.IN:
        condition = { [f.property]: In(f.value.split(',')) };
        break;
      case FilterOperators.NOT_IN:
        condition = { [f.property]: Not(In(f.value.split(','))) };
        break;
      case FilterOperators.BETWEEN:
        condition = {
          [f.property]: Between(f.value.split(',')[0], f.value.split(',')[1]),
        };
        break;
      default:
        return acc;
    }

    return iterativeDeepMerge(acc, createNestedStructure(condition));
  }, {});
};

// Function to transform flat object to nested structure
const createNestedStructure = (
  flatObject: Record<string, any>,
): NestedObject => {
  const result: NestedObject = {};

  // Iterate through each key-value pair in the flat object
  Object.entries(flatObject).forEach(([key, value]) => {
    const parts = key.split('.');
    let currentPart = result;

    // Iterate through parts of the key to build the nested structure
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // Check if we're at the last part; if so, assign the value
      if (i === parts.length - 1) {
        currentPart[part] = value;
      } else {
        // Create a nested object if it doesn't already exist
        if (!currentPart[part]) {
          currentPart[part] = {};
        }

        // Move deeper into the nested structure
        currentPart = currentPart[part];
      }
    }
  });

  return result;
};

const iterativeDeepMerge = (
  target: Record<string, any>,
  source: Record<string, any>,
) => {
  const stack = [{ target, source }];

  while (stack.length > 0) {
    const { target, source } = stack.pop();

    if (
      typeof target === 'object' &&
      typeof source === 'object' &&
      !(source instanceof FindOperator)
    ) {
      for (const key in source) {
        if (source[key] instanceof FindOperator) {
          target[key] = source[key];
        } else if (source[key] && typeof source[key] === 'object') {
          if (!target[key] || typeof target[key] !== 'object') {
            target[key] = Array.isArray(source[key]) ? [] : {};
          }
          stack.push({ target: target[key], source: source[key] });
        } else {
          target[key] = source[key];
        }
      }
    } else if (source instanceof FindOperator) {
      Object.assign(target, source);
    }
  }
  return target;
};

const deepMerge = (obj1, obj2) => {
  // Create a new object to hold the merged values
  const result = {};

  // Function to assign properties to result
  function assignValue(key, value) {
    if (typeof result[key] === 'object' && typeof value === 'object') {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }

  // Iterate over all keys in the first object
  for (const key in obj1) {
    assignValue(key, obj1[key]);
  }

  // Iterate over all keys in the second object
  for (const key in obj2) {
    assignValue(key, obj2[key]);
  }

  return result;
};

export const getOrder = (sort: Sorting) =>
  sort ? createNestedStructure({ [sort.property]: sort.direction }) : {};

export const getRelations = (relations: string[]) => {
  return relations.reduce((acc, r) => {
    if (!r) return acc;
    return iterativeDeepMerge(acc, createNestedStructure({ [r]: true }));
  }, {});
};

export const getSelect = (select: string[]) => {
  return select.reduce((acc, s) => {
    if (!s) return acc;
    return iterativeDeepMerge(acc, createNestedStructure({ [s]: true }));
  }, {});
};
