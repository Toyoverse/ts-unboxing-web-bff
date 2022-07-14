import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Parse from 'parse/node';
import { BoxService } from './box.service';
import ToyoModel from '../models/Toyo.model';
import { Crypt } from '../utils/crypt/crypt';
import di from '../di';
import { Box } from '../models/interfaces/IBox';
import { Eth } from 'web3-eth';
import { soliditySha3 } from 'web3-utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Eth = require('web3-eth');

@Injectable()
export class HashBoxService {
  private secretKey: string;

  constructor(
    private configService: ConfigService,
    private boxService: BoxService,
    @Inject(di.AESCrypt) private crypt: Crypt,
  ) {
    this.ParseServerConfiguration();
    this.secretKey = this.configService.get<string>('PRIVATE_KEY');
  }

  async generateHash(toyo: ToyoModel): Promise<string> {
    const json = JSON.stringify({ id: toyo.id, name: toyo.name });
    return this.crypt.encrypt(json, this.secretKey);
  }

  async decryptHash(hashbox: string): Promise<ToyoModel> {
    const jsonStr = this.crypt.decrypt(hashbox, this.secretKey);
    const { id, name } = JSON.parse(jsonStr);
    return new ToyoModel({ id, name });
  }

  async generateSignature(box: Box): Promise<string> {
    const eth: Eth = new Web3Eth();

    const today = Date.now();
    const code = `${box.tokenId}_${today}`;

    const message = soliditySha3(code);
    const { signature } = eth.accounts.sign(message, this.secretKey);

    return signature;
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
