export interface GetTokenSwappedEntitiesResp {
  tokenSwappedEntities: SwappedEntities[];
}

export interface SwappedEntities {
  fromTokenId: string;
  toTokenId: string;
  transactionHash: string;
  fromTypeId: string;
  toTypeId: string;
}
