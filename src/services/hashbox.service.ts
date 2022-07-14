import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Parse from 'parse/node';
import { BoxService } from './box.service';
import { Box } from '../models/interfaces/IBox';
import { Eth } from 'web3-eth';
import { soliditySha3 } from 'web3-utils';

const Web3Eth = require('web3-eth');

@Injectable()
export class HashBoxService {
  private secretKey: string | undefined;

  constructor(
    private configService: ConfigService,
    private boxService: BoxService,
  ) {
    this.ParseServerConfiguration();
    this.secretKey = this.configService.get<string>('PRIVATE_KEY');
  }

  async generateHash(toyo): Promise<any> {}

  async dencryptHash(hashbox: string): Promise<any> {}

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
