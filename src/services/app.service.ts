import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BoxModel from 'src/models/Box.model';
import * as Parse from 'parse/node';
import { OnchainService, BoxService, HashBoxService } from './index';
import { Response, response } from 'express';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private readonly onchainService: OnchainService,
    private readonly boxService: BoxService,
    private readonly hashboxService: HashBoxService,
  ) {
    this.ParseServerConfiguration();
  }
  async findBoxDetailById(walletAddress: string, id: string, response: Response): Promise<any> {
    try {
      const toyoId: string = Buffer.from(id, 'base64').toString('ascii');

      const box: BoxModel = await this.boxService.findBoxById(
        toyoId,
        walletAddress,
        response
      );

      const toyoSignature: string = await this.hashboxService.generateSignature(
        box,
      );

      const boxOnChain = await this.onchainService.getTokenOwnerEntityByTokenId(
        walletAddress,
        box.tokenId,
      );

      if (boxOnChain) {
        const player = box.player;
        player.set('hasPendingUnboxing', true);
        await player.save();
        return { ...box, toyoSignature };
      }

      return response.status(500).json({
        error: ['The box does not belong to the player'],
      });
    } catch (e) {
      console.log("ERRO");
      console.log({
        error: [e.message],
      });
    }
  }

  async openBox(id: string, res: Response) {
    try {
      const boxId: string = Buffer.from(id, 'base64').toString('ascii');
      const box: BoxModel = await this.boxService.openBox(boxId, res);

      return box;
    } catch (e) {
      console.log(e);
      console.log({
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
