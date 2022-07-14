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
              if (key === 'PRIVATE_KEY') {
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

  test('generate hash', async () => {
    const toyo = new ToyoModel({ id: 'id', name: 'name' });

    const json = JSON.stringify({ id: 'id', name: 'name' });
    const expectHash = 'fdalfdakfdasfadsv2';

    crypt.encrypt.mockReturnValue(expectHash);

    const hash = await hasboxService.generateHash(toyo);

    expect(crypt.encrypt).toBeCalledWith(json, privateKey);

    expect(hash).toEqual(expectHash);
  });

  test('decrypt hash', async () => {
    const hash = 'fdafdafdasfd';
    const decryptedObject = { id: 'toyo.id', name: 'toyo.name' };
    const decryptedJson = JSON.stringify(decryptedObject);
    crypt.decrypt.mockReturnValue(decryptedJson);

    const toyoModel = await hasboxService.decryptHash(hash);

    expect(crypt.decrypt).toHaveBeenCalledWith(hash, privateKey);

    expect(toyoModel.id).toEqual(decryptedObject.id);
    expect(toyoModel.name).toEqual(decryptedObject.name);
  });
});
