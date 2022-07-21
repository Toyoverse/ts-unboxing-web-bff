import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AESCrypt } from '../../../src/utils/crypt/aes-crypt';

describe('Unit tests for AES Crypt', () => {
  const CRYPTO_IV =
    '9a6eac0b2b23d3605ca1f021d20b84da469829a133081dc4a4b3aba63e6a9660';

  let aesCrypt: AESCrypt;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AESCrypt,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'CRYPTO_IV') {
                return CRYPTO_IV;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    aesCrypt = module.get<AESCrypt>(AESCrypt);
  });

  it('Test encrypt and decrypt', () => {
    const id = randomUUID();
    const key =
      '0x44c65c0d15ebce6578e11b728df1d145c27b0dbca1bfe541f5a2c4feb1ec8dd6';

    const cypher = aesCrypt.encrypt(id, key);
    const decodedId = aesCrypt.decrypt(cypher, key);

    expect(decodedId).toEqual(id);
  });
});
