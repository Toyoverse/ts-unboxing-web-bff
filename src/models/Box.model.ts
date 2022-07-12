import { Box } from "./interfaces/IBox";
import { ApiProperty } from '@nestjs/swagger';

export default class BoxModel implements Box{
    
    @ApiProperty()
    toyoHash: string;
    @ApiProperty()
    tokenId: string;
    @ApiProperty()
    typeId: string;
    @ApiProperty()
    tokenIdClosedBox: string;
    @ApiProperty()
    tokenIdOpenBox: string;

    constructor() {}

}