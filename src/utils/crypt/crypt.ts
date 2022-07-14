export interface Crypt {
  encrypt(data: string, key: string): string;
  decrypt(cipherText: string, key: string): string;
}
