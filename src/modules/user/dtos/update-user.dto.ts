import { ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {
    // Add any additional properties or methods specific to updating a user
    @ApiPropertyOptional({
        type: 'string',
        format: 'binary',
    })
    avatar?: any;
}