import { ApiProperty } from '@nestjs/swagger';
import { Toyo } from './interfaces/IToyo';
import ToyoPersonaModel from './ToyoPersona.model';

export default class ToyoModel implements Toyo {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  hasTenParts?: boolean;
  @ApiProperty()
  isToyoSelected?: boolean;
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updateAt?: Date;
  @ApiProperty()
  tokenId?: string;
  @ApiProperty()
  transactionHash?: string;
  @ApiProperty()
  toyoPersonaOrigin?: ToyoPersonaModel;

  constructor(attrs?: { id: string; name: string }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
    }
  }
}
