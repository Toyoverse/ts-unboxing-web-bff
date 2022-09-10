import { Box } from './interfaces/IBox';
import { ApiProperty } from '@nestjs/swagger';
import ToyoModel from './Toyo.model';
import * as Parse from 'parse/node';

export default class BoxModel implements Box {
  @ApiProperty()
  toyoHash?: string;
  @ApiProperty()
  toyoSignature?: string;
  @ApiProperty()
  tokenId: string;
  @ApiProperty()
  typeId: string;
  @ApiProperty()
  tokenIdClosedBox: string;
  @ApiProperty()
  tokenIdOpenBox: string;
  @ApiProperty()
  toyo: ToyoModel;
  @ApiProperty()
  isOpen: boolean;
  @ApiProperty()
  player?: Parse.Object<Parse.Attributes>;

  constructor() {}
}
