import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import buildFindQuery from '../helpers/build-find-query';
import { IValidParams } from '../interfaces/valid-query-params.interface';
import { FindQuery } from '../dtos/find-query.interface';
import { FindQueryDto } from '../dtos/find-query-request.dto';

export const FindQueryRequest = createParamDecorator(
  (validParams: IValidParams, ctx: ExecutionContext): FindQuery<any> => {
    const request = ctx.switchToHttp().getRequest();
    const queryDto: FindQueryDto = request.query;
    return buildFindQuery(queryDto, validParams);
  },
);
