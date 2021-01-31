import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EncryptionService {
  private readonly key: Buffer;
  private readonly algorithm = 'aes-256-ctr';

  constructor (private readonly config: ConfigService) {
    if (!this.config.get('CRYPT_SECRET')) {
      throw new Error('CRYPT_SECRET not specified in .env');
    }

    this.key = crypto
      .createHash('sha256')
      .update(this.config.get('CRYPT_SECRET'))
      .digest();
  }

  encrypt (text: string): string {
    if (text === null) {
      throw new Error('Text cannot be null or undefined.');
    }
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      const encrypted = cipher.update(String(text), 'utf8', 'hex') + cipher.final('hex');

      return iv.toString('hex') + encrypted;
    } catch (err) {
      throw new BadRequestException('Data not valid');
    }
  }

  decrypt (cryptedText: string): string {
    if (cryptedText == null) {
      throw new Error('Value must not be null or undefined');
    }

    try {
      const stringValue = String(cryptedText);
      const iv = Buffer.from(stringValue.slice(0, 32), 'hex');
      const encrypted = stringValue.slice(32);

      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    } catch (err) {
      throw new BadRequestException('Data not valid');
    }
  }
}
