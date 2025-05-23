import { BadRequestException } from "@nestjs/common";
import { FindQueryDto } from "../dtos/find-query.dto";
import { IFindQuery } from "../interfaces/find-query.interface";
import { IValidParams } from "../interfaces/valid-query-params.interface";

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

export default function buildFindQuery<T>(queryDto: FindQueryDto, validParams: IValidParams): IFindQuery<T> {
    let { search } = queryDto

    if (search) {
        // check if the valid params sent is an array
        if (typeof validParams.search != 'object')
            throw new BadRequestException('Invalid search parameters');

        if (!Array.isArray(search))
            search = [search]

        // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
        const result = search.every((f) => {
            return (
                f.match(
                    /^[a-zA-Z0-9\u06F0-\u06F9._]+::(eq|neq|gt|gte|lt|lte|like|nlike|in|nin|between)::[a-zA-Zآ-ی0-9\u06F0-\u06F9_: ,-/)()]+$/,
                ) || f.match(/^[a-zA-Z0-9_]+::(isnull|isnotnull)$/)
            );
        });

        if (!result)
            throw new BadRequestException('Invalid filter parameter');



    }
    return
}