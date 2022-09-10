import { Toyo } from './IToyo';
import * as Parse from 'parse/node';

export interface Box {
  toyoHash?: string;
  tokenId: string;
  typeId: string;
  tokenIdClosedBox: string;
  tokenIdOpenBox: string;
  toyo: Toyo;
  isOpen: boolean;
  player?: Parse.Object<Parse.Attributes>;
}
