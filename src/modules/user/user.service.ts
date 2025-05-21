import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/crud/base.service';
import { UserModel } from './models/user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<UserModel> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }
}
