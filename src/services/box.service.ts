import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BoxModel from '../models/Box.model';
import * as Parse from 'parse/node';
import { response, Response } from 'express';
import { TypeId } from 'src/enums/SmartContracts';
import { HashBoxService } from './hashbox.service';
import { ToyoService } from './toyo.service';

@Injectable()
export class BoxService {
  constructor(
    private configService: ConfigService,
    private readonly hashBoxService: HashBoxService,
    private readonly toyoService: ToyoService,
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
      const playerQuery = this.createPlayerQuery();
      playerQuery.equalTo('objectId', result.get('player').id);

      const player = await playerQuery.find();
      if (result.get('isOpen')) {
        return res.status(404).json({
          error: ['Box is already open'],
        });
      }

      const toyoHash = await this.hashBoxService.decryptHash(
        result.get('toyoHash'),
      );
      const toyo = await this.toyoService.findToyoById(toyoHash.id);

      const parts = await toyo[0].relation('parts').query().find();

      const typeIdOpenBox: string = this.generateTypeIdOpenBox(
        result.get('typeId'),
      );

      result.set('toyo', toyo[0]);
      result.set('isOpen', true);
      result.set('typeId', typeIdOpenBox);
      result.set('typeIdOpenBox', typeIdOpenBox);
      const relation = result.relation('parts');
      relation.add(parts);
      await result.save();

      player[0].set('hasPendingUnboxing', false);
      await player[0].save();

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
