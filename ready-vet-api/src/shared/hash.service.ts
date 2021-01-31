import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async cryptPassword (password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async isValidPassword (password: string, cryptedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, cryptedPassword);
  }
}