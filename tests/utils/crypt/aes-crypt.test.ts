import { randomUUID } from 'crypto';
import { AESCrypt } from '../../../src/utils/crypt/aes-crypt';

describe('Unit tests for AES Crypt', () => {
  const aesCrypt = new AESCrypt();
  it('Test encrypt and decrypt', () => {
    const id = randomUUID();
    const key =
      '0x44c65c0d15ebce6578e11b728df1d145c27b0dbca1bfe541f5a2c4feb1ec8dd6';

    const cypher = aesCrypt.encrypt(id, key);
    console.log(cypher);
    console.log(cypher.length);
    const decodedId = aesCrypt.decrypt(cypher, key);

    expect(decodedId).toEqual(id);
  });
});
