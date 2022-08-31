import { Injectable } from '@nestjs/common';
import { BoxService, OnchainService, ToyoService } from 'src/services';

@Injectable()
export class ToyoJobConsumer {
  constructor(
    private readonly onChainService: OnchainService,
    private readonly toyoService: ToyoService,
    private readonly boxService: BoxService,
  ) {}

  async saveToyoJob(
    result: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>[],
  ) {
    let i = 0;
    setTimeout(async () => {
      while (i < 5) {
        const swappedEntities =
          await this.onChainService.getTokenSwappedEntitiesByClosedBoxTokenId(
            result.get('tokenIdClosedBox'),
          );

        if (swappedEntities.length === 0) {
          i++;
        } else {
          const blockchainToyo = swappedEntities.find(
            (i) => i.toTypeId === '9',
          );
          const blockchainBox = swappedEntities.find((i) => i.toTypeId !== '9');

          toyo[0].set('tokenId', blockchainToyo.toTokenId);
          toyo[0].set('transactionHash', blockchainToyo.transactionHash);
          await toyo[0].save();

          // await this.boxService.updateBoxFields(result, toyo, blockchainBox);
          i = 5;
        }
      }
    }, 10000);
  }
}
