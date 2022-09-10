import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { request, gql } from 'graphql-request';
import {
  GetTokenSwappedEntitiesResp,
  SwappedEntities,
} from '../models/interfaces/IChain';

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

  async getTokenSwappedEntitiesByClosedBoxTokenId(
    closedBoxTokenId: string,
  ): Promise<SwappedEntities[]> {
    const query = gql`
      {
        tokenSwappedEntities(where: {fromTokenId: ${closedBoxTokenId}}) {
          fromTokenId,
          toTokenId,
          transactionHash,
          fromTypeId,
          toTypeId
        }
      }
    `;

    const data = await request<GetTokenSwappedEntitiesResp>(
      this.configService.get<string>('THEGRAPH_URL'),
      query,
    );

    return data.tokenSwappedEntities;
  }
}
