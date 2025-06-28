import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FindQueryDto } from 'src/common/dtos/find-query-request.dto';
import { FindQueryRequest } from 'src/common/decorators/find-query.decorator';
import { FindQuery } from 'src/common/dtos/find-query.interface';
import { UserModel } from './models/user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { IActiveUserData } from 'src/common/interfaces/active-user-data';
import { AvatarUploadInterceptor } from './interceptors/avatar-upload.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('user')
@ApiBearerAuth('token')
export class UserController {
  constructor(private readonly userService: UserService) {
    // Constructor logic here
  }

  // Create a new user
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Get all users
  @Get()
  findAll(
    @Query() findQueryDto: FindQueryDto,
    @FindQueryRequest({
      filters: [],
      sort: [],
      relations: [],
    })
    findQuery: FindQuery<UserModel>,
  ) {
    return this.userService.find(findQuery);
  }

  @Get('active')
  getActiveUsers(@ActiveUser() activeUser: IActiveUserData) {
    return activeUser;
  }

  // Get user by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // Update user by ID
  @Put(':id')
  @UseInterceptors(AvatarUploadInterceptor)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary'
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile('file') file: any) {
    console.log(file);

    return
    return this.userService.updateById(id, updateUserDto);
  }

  // Delete user by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }
}
