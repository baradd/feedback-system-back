import { Body, Controller, Delete, Param, Post, Put, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FindQueryDto } from 'src/common/dtos/find-query.dto';
import { FindQuery } from 'src/common/decorators/find-query.decorator';
import { IFindQuery } from 'src/common/interfaces/find-query.interface';
import { UserModel } from './models/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
    // Constructor logic here
  }

  // Create a new user
  @Post()
  create(@Body() createUserDto: any) {
    return this.userService.create(createUserDto);
  }

  // Get all users
  @Get()
  findAll(
    @Query() findQueryDto: FindQueryDto,
    @FindQuery({
      search: [],
      sort: [],
      relations: [],
    }) findQuery: IFindQuery<UserModel>) {
    return this.userService.find(findQuery);
  }

  // Get user by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // Update user by ID
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.userService.updateById(id, updateUserDto);
  }

  // Delete user by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }

}

