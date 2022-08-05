import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { response } from 'express';
import { parseType } from 'graphql';
import * as Parse from 'parse/node';
import ToyoModel from 'src/models/Toyo.model';
@Injectable()
export class ToyoService {
  constructor(private configService: ConfigService) {
    this.ParseServerConfiguration();
  }
  async findToyoById(id: string) {
    const Toyo = Parse.Object.extend('Toyo');
    const toyoQuery = new Parse.Query(Toyo);
    toyoQuery.equalTo('objectId', id);

    try {
      const result = await toyoQuery.include('parts').find();

      if (result.length < 1 || result[0].id !== id) {
        response.status(404).json({
          erros: ['Toyo not found!'],
        });
        return;
      }
      return result;
    } catch (error) {
      response.status(500).json({
        error: [error.message],
      });
    }
  }

  toyoMapper(result: Parse.Object<Parse.Attributes>, parts: Parse.Object<Parse.Attributes>[]): ToyoModel{
    return {
        id: this.objectIdEncoded(result.id),
        name: result.get('name'),
        hasTenParts: result.get('hasTenParts'),
        parts: parts.map(part=>{
            delete part.id;
            return part;
        }),
        isToyoSelected: result.get('isToyoSelected'),
        tokenId: result.get('tokenId'),
        transactionHash: result.get('transactionHash'),
        toyoPersonaOrigin: result.get('toyoPersonaOrigin'),
        createdAt: result.get('createdAt'),
        updateAt: result.get('updateAt')
    }

  }
  private  objectIdEncoded(objectId: string):string {
    return Buffer.from(objectId).toString('base64');
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
