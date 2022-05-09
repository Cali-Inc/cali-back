import { utils } from 'ethers';

export const verifySign = (message: string, signature: string) =>
  utils.verifyMessage(message, signature);
