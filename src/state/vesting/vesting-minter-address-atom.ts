import { atom } from 'recoil';
import { localStorageEffect } from '../effects';

export const vestingMinterAddressAtom = atom({
  key: 'vestingMinterAddressAtom',
  default: undefined,
  effects: [
    localStorageEffect<string | undefined>({
      key: 'vesting-minter-address',
      isValid: (value) => typeof value === 'string',
    }),
  ],
});
