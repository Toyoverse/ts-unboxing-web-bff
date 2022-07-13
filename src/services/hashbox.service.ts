import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BoxModel from '../models/Box.model';
import * as Parse from 'parse/node';
import { response } from 'express';
import { BoxService } from './box.service';

@Injectable()
export class HashBoxService {
  constructor(
    private configService: ConfigService,
    private boxService: BoxService,
    private secretKey: string,
  ) {
    this.ParseServerConfiguration();
    this.secretKey = this.configService.get<string>('PRIVATE_KEY');
  }

  async generateHash(toyo): Promise<any> {}

  async dencryptHash(hashbox: string): Promise<any> {}

  async generateSignature(player): Promise<any> {}

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
