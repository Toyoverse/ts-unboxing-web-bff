import { Injectable } from "@nestjs/common";
import * as qjobs from 'qjobs'
import { OnchainService } from "src/services";
import { ToyoJobConsumer } from "./toyoJob-consumer";
import { Response } from 'express';
import ToyoModel from "src/models/Toyo.model";

@Injectable()
export class ToyoJobProducer{
    constructor(
        private readonly toyoJobConsumer: ToyoJobConsumer,
        ){}

    async saveToyo(result: Parse.Object<Parse.Attributes>, toyo:Parse.Object<Parse.Attributes>[]){
        const q = new qjobs();
        q.add(this.toyoJobConsumer.saveToyoJob(result, toyo));
        
    }

}