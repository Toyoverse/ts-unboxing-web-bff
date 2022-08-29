import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import di from '../../src/di';
import ToyoModel from '../../src/models/Toyo.model';
import { BoxService } from '../../src/services/box.service';
import { HashBoxService } from '../../src/services/hashbox.service';

describe('Unit tests for HashBox service', () => {
  const privateKey = 'toyo123';

  const crypt = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

  let hasboxService: HashBoxService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HashBoxService,
        BoxService,
        {
          provide: di.AESCrypt,
          useValue: crypt,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'PRIVATE_KEY_HASHBOX') {
                return privateKey;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    hasboxService = module.get<HashBoxService>(HashBoxService);
  });

  test('generate hash', () => {
    const id = '4BrO23lLIa';
    const toyo = new ToyoModel({ id, name: 'name' });

    const expectHash = 'fdalfdakfdasfadsv2';

    crypt.encrypt.mockReturnValue(expectHash);

    const hash = hasboxService.generateHash(toyo);

    expect(crypt.encrypt).toBeCalledWith(id, privateKey);

    expect(hash).toEqual(expectHash);
  });

  test('decrypt hash', () => {
    const hash = 'fdafdafdasfd';
    const decryptedId = '4BrO23lLIa';
    crypt.decrypt.mockReturnValue(decryptedId);

    const id = hasboxService.decryptHash(hash);

    expect(crypt.decrypt).toHaveBeenCalledWith(hash, privateKey);

    expect(id).toEqual(decryptedId);
  });
});
