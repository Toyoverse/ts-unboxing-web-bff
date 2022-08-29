import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AESCrypt {
  private iv: CryptoJS.lib.WordArray;

  private cfg: any;

  constructor() {
    this.iv = CryptoJS.enc.Hex.parse(process.env.CRYPTO_IV);

    this.cfg = {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      format: CryptoJS.format.Hex,
    };
  }

  encrypt(text: string, hexKey: string): string {
    const _key = CryptoJS.enc.Hex.parse(hexKey.replace('0x', ''));
    return CryptoJS.AES.encrypt(text, _key, this.cfg).toString();
  }

  decrypt(ciphertext: string, hexKey: string): string {
    const _key = CryptoJS.enc.Hex.parse(hexKey.replace('0x', ''));
    return CryptoJS.AES.decrypt(ciphertext, _key, this.cfg).toString(
      CryptoJS.enc.Utf8,
    );
  }
}
