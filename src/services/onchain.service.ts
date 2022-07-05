import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeId } from '../enums/SmartContracts';
import { request, gql } from 'graphql-request';

@Injectable()
export class OnchainService {
  constructor(private configService: ConfigService) {}

  async getTokenOwnerEntityByTokenId(
    walletId: string,
    tokenId: string,
  ): Promise<any> {
    console.log(walletId);
    const query = gql`
      {
        tokenOwnerEntities(first: 100, where: {currentOwner: "${walletId}", tokenId: "${tokenId}"}) {
          typeId,
          transactionHash,
          tokenId,
          currentOwner
        }
      }
    `;
    const data: any = await request(
      this.configService.get<string>('THEGRAPH_URL'),
      query,
    );

    return data.tokenOwnerEntities;
  }
}
