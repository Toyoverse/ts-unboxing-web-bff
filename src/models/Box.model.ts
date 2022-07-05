import { Box } from "./interfaces/IBox";
import { ApiProperty } from '@nestjs/swagger';

export default class BoxModel implements Box{
    
    @ApiProperty()
    TransationHash: string;
    @ApiProperty()
    tokenId: string;
    @ApiProperty()
    typeId: string;
    @ApiProperty()
    idClosedBox: string;

    constructor() {}

}