import { Injectable } from '@nestjs/common';
import { Crypt } from './crypt';

import * as CryptoJS from 'crypto-js';

@Injectable()
export class AESCrypt implements Crypt {
  private iv = CryptoJS.enc.Hex.parse(
    '9a6eac0b2b23d3605ca1f021d20b84da469829a133081dc4a4b3aba63e6a9660',
  );

  private cfg = {
    iv: this.iv,
    mode: CryptoJS.mode.CBC,
    format: CryptoJS.format.Hex,
  };

  encrypt(text: string, hexKey: string): string {
    hexKey = hexKey.replace('0x', '');

    const _key = CryptoJS.enc.Hex.parse(hexKey);
    return CryptoJS.AES.encrypt(text, _key, this.cfg).toString();
  }

  decrypt(ciphertext: string, hexKey: string): string {
    hexKey = hexKey.replace('0x', '');

    const _key = CryptoJS.enc.Hex.parse(hexKey);
    return CryptoJS.AES.decrypt(ciphertext, _key, this.cfg).toString(
      CryptoJS.enc.Utf8,
    );
  }
}
