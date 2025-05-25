import { Module } from '@nestjs/common';
import { BCryptService } from 'src/common/providers/bcrypt.service';

@Module({
  imports: [],
  providers: [BCryptService],
  exports: [],
})
export class AuthenticationModule { }
