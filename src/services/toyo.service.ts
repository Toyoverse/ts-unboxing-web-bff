import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import * as Parse from 'parse/node';
import { response } from "express";
import BoxModel from "src/models/Box.model";
import { BoxService } from "./box.service";
import * as fs from 'fs';

@Injectable()
export class ToyoService{
    constructor(
        private configService: ConfigService,
        private readonly boxService: BoxService,
        ) {
        this.ParseServerConfiguration();
    }
    async generateMetadata(idBox: string, toyoTokenId: string){
        try {
       
        const boxId: string = Buffer.from(idBox, 'base64').toString('ascii');
        const box:BoxModel = await this.boxService.findBoxById(boxId);
        const toyo = await this.findToyoByTokenId(toyoTokenId);

        const ToyoPersona = Parse.Object.extend("ToyoPersona");
        const toyoPersonaQuery = new Parse.Query(ToyoPersona);
        toyoPersonaQuery.equalTo("objectId", toyo[0].get('toyoPersonaOrigin').id)
        const toyoPersona = await toyoPersonaQuery.find();

        const objMetadata:object = this.createJsonMetadata(toyoPersona[0]); 

        const filePath:string = "./files/";
        const metadata:string = filePath.concat(box.toyoHash.concat(".json"));

        const objString = JSON.stringify(objMetadata, null, 2);

        fs.writeFileSync(metadata, objString, 'utf-8');

        toyo[0].set('toyoMetadata', objMetadata);
        await toyo[0].save();
 
        } catch(error) {
            response.status(500).json({
              error: [error.message],
            });
        }

    }
    async findToyoByTokenId(tokenId: string): Promise<Parse.Object[]> {
        const Toyo = Parse.Object.extend('Toyo');
        const toyoQuery = new Parse.Query(Toyo);
        toyoQuery.equalTo('tokenId', tokenId);
    
        try {
          const result = await toyoQuery.find();
          return result;
        } catch (error) {
          response.status(500).json({
            error: [error.message],
          });
        }
      }
      private createJsonMetadata(toyoPersona: Parse.Object<Parse.Attributes>): object{
        return {
            name: toyoPersona.get("name"),
	        description: toyoPersona.get("description"),
	        image: toyoPersona.get("thumbnail"),
	        animation_url: toyoPersona.get("video"),
	        attributes: [{
			    trait_type: "Type",
			    value: 9
		        },
		        {
			    trait_type: "Toyo",
			    value: "Ribbit"
		        },
		        {
			    trait_type: "Region",
			    value: toyoPersona.get("region")
		        },
		        {
			    trait_type: "Rarity",
			    value: toyoPersona.get("rarity")
		        },
		        {
			    display_type: "number",
			    trait_type: "Vitality",
			    value: 32
		        },
		        {
			    display_type: "number",
			    trait_type: "Strength",
			    value: 39
		        },
		        {
			    display_type: "number",
			    trait_type: "Resistance",
			    value: 59
		        },
		        {
			    display_type: "number",
			    trait_type: "CyberForce",
			    value: 32
		        },
		        {
			    display_type: "number",
			    trait_type: "Resilience",
			    value: 78
		        },
		        {
			    display_type: "number",
			    trait_type: "Precision",
			    value: 25
		        },
		        {
			    display_type: "number",
			    trait_type: "Technique",
			    value: 65
		        },
		        {
			    display_type: "number",
			    trait_type: "Analysis",
			    value: 109
		        },
		        {
			    display_type: "number",
			    trait_type: "Speed",
			    value: 110
		        },
		        {
			    display_type: "number",
			    trait_type: "Agility",
			    value: 78
		        },
		        {
			    display_type: "number",
			    trait_type: "Stamina",
			    value: 115
		        },
		        {
			    display_type: "number",
			    trait_type: "Luck",
			    value: 109
		        }
	        ]       
        };
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