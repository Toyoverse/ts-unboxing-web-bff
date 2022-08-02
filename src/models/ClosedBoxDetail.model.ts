import { Box } from './interfaces/IBox';
import { ApiProperty } from '@nestjs/swagger';
import ToyoModel from './Toyo.model';
import * as Parse from 'parse/node';

export default class ClosedBoxDetail {
  @ApiProperty()
  toyoHash?: string;
  @ApiProperty()
  toyoSignature?: string;
  @ApiProperty()
  tokenId: string;
  @ApiProperty()
  typeId: string;
  @ApiProperty()
  isOpen: boolean;

  constructor() {}
}
