import { ApiProperty } from '@nestjs/swagger';
import { Toyo } from './interfaces/IToyo';

export default class ToyoModel implements Toyo {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;

  constructor(attrs?: { id: string; name: string }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
    }
  }
}
