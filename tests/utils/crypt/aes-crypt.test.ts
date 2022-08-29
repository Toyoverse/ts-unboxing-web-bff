import { AESCrypt } from 'src/utils/crypt/aes-crypt';

process.env.CRYPTO_IV =
  '9a6eac0b2b23d3605ca1f021d20b84da469829a133081dc4a4b3aba63e6a9660';

describe('Unit tests for AES Crypt', () => {
  const aesCrypt = new AESCrypt();

  it('Test encrypt and decrypt', () => {
    const toyoId = '4BrO23lLIa';
    const key =
      '44c65c0d15ebce6578e11b728df1d145c27b0dbca1bfe541f5a2c4feb1ec8dd6';

    const cypher = aesCrypt.encrypt(toyoId, key);
    const decodedToyoId = aesCrypt.decrypt(cypher, key);

    expect(toyoId).toEqual(decodedToyoId);
  });
});
