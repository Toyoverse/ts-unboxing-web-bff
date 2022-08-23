import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Box } from '../../models/interfaces/IBox';
import { BoxService } from '../../services/box.service';
import { HashBoxService } from '../../services/hashbox.service';
import di from '../../di';

describe('HashboxService', () => {
  const privateKey =
    '0x8b29f2d15bbb36597c8218291b5c6422332f8d56b108a70b90a40a85664243c6';
  let hashboxService: HashBoxService;

  const crypt = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

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

    hashboxService = module.get<HashBoxService>(HashBoxService);
  });

  describe('generateSignature', () => {
    it('should return the signature', async () => {
      const box: Box = {
        tokenId: '1677',
        tokenIdClosedBox: '123',
        tokenIdOpenBox: '1677',
        toyoHash: 'abc',
        typeId: '10',
        toyo: {
          id: 'x5AOWbpfA8',
          name: 'Ming Yue',
        },
        isOpen: false,
      };

      const expectHash = 'fdalfdakfdasfadsv2';

      crypt.encrypt.mockReturnValue(expectHash);

      const signature = await hashboxService.generateSignature(box);

      expect(typeof signature).toBe('string');
    });
  });
});
