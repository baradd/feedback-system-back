import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BCryptService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return hash(data, salt);
  }

  async compare(data: string | Buffer, hashed: string): Promise<boolean> {
    try {
      return compare(data, hashed);
    } catch (error) {
      throw new Error('Error comparing data with hash: ' + error.message);
    }
  }
}
