import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import BoxModel from '../models/Box.model';
import * as Parse from 'parse/node';
import { TypeId } from 'src/enums/SmartContracts';
import { response } from "express";

@Injectable()
export class BoxService {
    constructor(
        private configService: ConfigService,
      ) {
        this.ParseServerConfiguration();
      }

    async findBoxById(id: string): Promise<BoxModel>{
        const Boxes = Parse.Object.extend('Boxes', BoxModel);
        const boxesQuery = new Parse.Query(Boxes);
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

    private BoxMapper(result: Parse.Object<Parse.Attributes>): BoxModel {
        const box:BoxModel = new BoxModel(); 
        
        box.toyoHash = result.get('toyoHash');
        box.typeId = result.get('typeId');
        box.tokenId = result.get('tokenId');

        return box;
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