import { Toyo } from './IToyo';

export interface Box {
  toyoHash: string;
  tokenId: string;
  typeId: string;
  tokenIdClosedBox: string;
  tokenIdOpenBox: string;
  toyo: Toyo;
  isOpen: boolean;
}
