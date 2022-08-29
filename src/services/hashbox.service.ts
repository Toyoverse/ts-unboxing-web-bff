import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Parse from 'parse/node';
import ToyoModel from '../models/Toyo.model';
import { Crypt } from '../utils/crypt/crypt';
import di from '../di';
import { Box } from '../models/interfaces/IBox';
import { Eth } from 'web3-eth';
import { soliditySha3 } from 'web3-utils';
import { response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Eth = require('web3-eth');

@Injectable()
export class HashBoxService {
  private secretKey: string;

  constructor(
    private configService: ConfigService,
    @Inject(di.AESCrypt) private crypt: Crypt,
  ) {
    this.ParseServerConfiguration();
    this.secretKey = this.configService.get<string>('PRIVATE_KEY_HASHBOX');
  }

  generateHash(toyo: ToyoModel): string {
    return this.crypt.encrypt(toyo.id, this.secretKey);
  }
  decryptHash(hashbox: string): string {
    return this.crypt.decrypt(hashbox, this.secretKey);
  }

  async generateSignature(box: Box): Promise<string> {
    try {
      const { toyo } = box;

      const eth: Eth = new Web3Eth();
      const hash: string = box.toyoHash;

      const message = soliditySha3(box.tokenId + hash);
      const { signature } = eth.accounts.sign(message, this.secretKey);

      return signature;
    } catch (e) {
      response.status(500).json({
        error: [e.message],
      });
    }
  }

  /**
   * Function to configure ParseSDK
   */
  private ParseServerConfiguration(): void {
    Parse.initialize(
      this.configService.get<string>('BACK4APP_APPLICATION_ID'),
      this.configService.get<string>('BACK4APP_JAVASCRIPT_KEY'),
      this.configService.get<string>('BACK4APP_MASTER_KEY'),
    );
    (Parse as any).serverURL = this.configService.get<string>(
      'BACK4APP_SERVER_URL',
    );
  }
}
