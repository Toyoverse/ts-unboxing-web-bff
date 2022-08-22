import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BoxModel from '../models/Box.model';
import * as Parse from 'parse/node';
import { Response } from 'express';
import { TypeId } from '../enums/SmartContracts';
import { HashBoxService } from './hashbox.service';
import { ToyoService } from './toyo.service';
import { OnchainService } from './onchain.service';
import { SwappedEntities } from '../models/interfaces/IChain';

@Injectable()
export class BoxService {
  constructor(
    private configService: ConfigService,
    private readonly hashBoxService: HashBoxService,
    private readonly toyoService: ToyoService,
    private readonly onChainService: OnchainService,
  ) {
    this.ParseServerConfiguration();
  }

  async findBoxById(
    id: string,
    walletAddress: string,
    response: Response,
  ): Promise<any> {
    const playerQuery = this.createPlayerQuery();
    playerQuery.equalTo('walletAddress', walletAddress);
    const boxesQuery = this.createBoxQuery();
    boxesQuery.equalTo('objectId', id);
    boxesQuery.include('toyo');
    try {
      const player = await playerQuery.find();
      const result = await boxesQuery.find();

      if (result.length < 1 || result[0].id !== id) {
        return response.status(404).json({
          erros: ['Box not found!'],
        });
      }

      const box: BoxModel = this.BoxMapper(result[0], player[0]);

      if (!result[0].get('isOpen')) return box;

      return response.status(500).json({
        error: ['The box is not closed'],
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        error: [error.message],
      });
    }
  }

  async openBox(id: string, res: Response): Promise<any> {
    const query = this.createBoxQuery();
    query.include(['player']);

    try {
      const result = await query.get(id);

      if (result.get('isOpen')) {
        return res.status(404).send({
          error: ['Box is already open'],
        });
      }

      const playerQuery = this.createPlayerQuery();
      const player = await playerQuery.get(result.get('player').id);

      const toyoHash = await this.hashBoxService.decryptHash(
        result.get('toyoHash'),
      );

      const swappedEntities =
        await this.onChainService.getTokenSwappedEntitiesByClosedBoxTokenId(
          result.get('tokenIdClosedBox'),
        );

      if (swappedEntities.length === 0) {
        return res.status(500).json({
          error: ['An error occurred with the box opening transaction'],
        });
      }

      const blockchainToyo = swappedEntities.find((i) => i.toTypeId === '9');
      const blockchainBox = swappedEntities.find((i) => i.toTypeId !== '9');

      const toyo = await this.toyoService.findToyoById(toyoHash.id);
      toyo[0].set('tokenId', blockchainToyo.toTokenId);
      toyo[0].set('transactionHash', blockchainToyo.transactionHash);
      await toyo[0].save();

      const parts = await toyo[0].relation('parts').query().find();

      await this.updatePlayerFields(toyo, parts, player);
      await this.updateBoxFields(result, blockchainBox, toyo);

      const box: BoxModel = this.BoxMapper(result);
      box.isOpen = true;
      box.toyo = this.toyoService.toyoMapper(toyo[0], parts);

      return box;
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: [e.message],
      });
    }
  }

  private BoxMapper(
    result: Parse.Object<Parse.Attributes>,
    player?: Parse.Object<Parse.Attributes>,
  ): BoxModel {
    const box: BoxModel = new BoxModel();

    box.toyoHash = result.get('toyoHash');
    box.typeId = result.get('typeId');
    box.tokenId = result.get('tokenId');
    box.toyo = result.get('toyo');
    box.isOpen = result.get('isOpen');
    if (player) box.player = player;

    return box;
  }

  private createPlayerQuery(): Parse.Query {
    const Player = Parse.Object.extend('Players');
    const playerQuery = new Parse.Query(Player);
    return playerQuery;
  }

  private createBoxQuery(): Parse.Query {
    const Boxes = Parse.Object.extend('Boxes', BoxModel);
    const query: Parse.Query = new Parse.Query(Boxes);

    return query;
  }

  private async updateBoxFields(
    boxQuery: Parse.Object<Parse.Attributes>,
    blockchainBox: SwappedEntities,
    toyo: Parse.Object<Parse.Attributes>[],
  ) {
    const typeIdOpenBox: string = this.generateTypeIdOpenBox(
      boxQuery.get('typeId'),
    );

    boxQuery.set('toyo', toyo[0]);
    boxQuery.set('isOpen', true);
    boxQuery.set('typeId', typeIdOpenBox);
    boxQuery.set('typeIdOpenBox', typeIdOpenBox);
    boxQuery.set('tokenIdOpenBox', blockchainBox.toTokenId);
    boxQuery.set('tokenId', blockchainBox.toTokenId);
    boxQuery.set('transactionHash', blockchainBox.transactionHash);

    await boxQuery.save();
  }

  private async updatePlayerFields(
    toyo: Parse.Object<Parse.Attributes>[],
    toyoParts: Parse.Object<Parse.Attributes>[],
    playerQuery: Parse.Object<Parse.Attributes>,
  ) {
    const toyoRelation = playerQuery.relation('toyos');
    toyoRelation.add(toyo);

    const toyoPartsRelation = playerQuery.relation('toyoParts');
    toyoPartsRelation.add(toyoParts);

    playerQuery.set('hasPendingUnboxing', false);
    await playerQuery.save();
  }

  private generateTypeIdOpenBox(type: string): string {
    const key: number = parseInt(type, 10);
    switch (key) {
      case TypeId.TOYO_FORTIFIED_JAKANA_SEED_BOX:
        return String(TypeId.OPEN_FORTIFIED_JAKANA_SEED_BOX);
        break;
      case TypeId.TOYO_JAKANA_SEED_BOX:
        return String(TypeId.OPEN_JAKANA_SEED_BOX);
        break;
      case TypeId.TOYO_FORTIFIED_KYTUNT_SEED_BOX:
        return String(TypeId.OPEN_FORTIFIED_KYTUNT_SEED_BOX);
        break;
      case TypeId.TOYO_KYTUNT_SEED_BOX:
        return String(TypeId.OPEN_KYTUNT_SEED_BOX);
        break;
      default:
        return undefined;
        break;
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
