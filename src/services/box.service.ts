import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BoxModel from '../models/Box.model';
import * as Parse from 'parse/node';
import { response } from 'express';

@Injectable()
export class BoxService {
  constructor(private configService: ConfigService) {
    this.ParseServerConfiguration();
  }

  async findBoxById(id: string): Promise<BoxModel> {
    const boxesQuery = this.createBoxQuery();
    boxesQuery.equalTo('objectId', id);
    try {
      const result = await boxesQuery.find();

      if (result.length < 1 || result[0].id !== id) {
        response.status(404).json({
          erros: ['Box not found!'],
        });
      }

      const box: BoxModel = this.BoxMapper(result[0]);

      if (!result[0].get('isOpen')) return box;

      response.status(500).json({
        error: ['The box is not closed'],
      });
    } catch (error) {
      response.status(500).json({
        error: [error.message],
      });
    }
  }

  async openBox(id: string): Promise<any> {
    const query = this.createBoxQuery();
    query.include(['toyo', 'toyo.toyoPersonaOrigin']);

    try {
      const result = await query.get(id);

      if (result.get('isOpen')) {
        response.status(404).json({
          erros: ['Box is already open'],
        });
      }

      result.set('isOpen', true);
      const saveRes = await result.save();
      const box: BoxModel = this.BoxMapper(saveRes);

      const parts = await saveRes.relation('parts').query().find();

      const data = {
        ...box,
        toyoParts: parts,
      };

      return data;
    } catch (e) {
      response.status(500).json({
        error: [e.message],
      });
    }
  }

  private BoxMapper(result: Parse.Object<Parse.Attributes>): BoxModel {
    const box: BoxModel = new BoxModel();

    box.toyoHash = result.get('toyoHash');
    box.typeId = result.get('typeId');
    box.tokenId = result.get('tokenId');
    box.toyo = result.get('toyo');

    return box;
  }

  private createBoxQuery(): Parse.Query {
    const Boxes = Parse.Object.extend('Boxes', BoxModel);
    const query: Parse.Query = new Parse.Query(Boxes);

    return query;
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
