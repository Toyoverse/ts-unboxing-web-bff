import { AESCrypt } from '../../../src/utils/crypt/aes-crypt';

describe('Unit tests for AES Crypt', () => {
  const aesCrypt = new AESCrypt();
  it('Test encrypt and decrypt', () => {
    const toyo = { id: 'toyo.id', name: 'toyo.name' };
    const key = 'hello world';
    const jsonToyo = JSON.stringify(toyo);
    const cypher = aesCrypt.encrypt(jsonToyo, key).toString();
    const decodedJson = aesCrypt.decrypt(cypher, key);
    const decodedToyo = JSON.parse(decodedJson);

    expect(toyo).toEqual(decodedToyo);
  });
});
