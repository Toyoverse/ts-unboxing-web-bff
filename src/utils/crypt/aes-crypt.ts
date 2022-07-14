import { Injectable } from '@nestjs/common';
import { Crypt } from './crypt';

import { AES, enc } from 'crypto-js';

@Injectable()
export class AESCrypt implements Crypt {
  encrypt(data: string, key: string): string {
    return AES.encrypt(data, key).toString();
  }

  decrypt(cypherText: string, key: string): string {
    return AES.decrypt(cypherText, key).toString(enc.Utf8);
  }
}
