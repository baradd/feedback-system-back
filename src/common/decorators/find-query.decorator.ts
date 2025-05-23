import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import buildFindQuery from '../helpers/build-find-query';
import { IValidParams } from '../interfaces/valid-query-params.interface';
import { IFindQuery } from '../interfaces/find-query.interface';
import { FindQueryDto } from '../dtos/find-query.dto';


export const FindQuery = createParamDecorator(
    (validParams: IValidParams, ctx: ExecutionContext): IFindQuery<any> => {
        const request = ctx.switchToHttp().getRequest();
        const queryDto: FindQueryDto = request.query;
        return buildFindQuery(queryDto, validParams);
    },
);