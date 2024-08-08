import { OpenedContract } from '@ton/core';
import { selector } from 'recoil';
import { tonClientSelector } from '../ton';
import { jettonMinterAddressAtom } from './jetton-minter-address-atom';
import Jetton from '/src/contracts/Jetton';
import { getAddress } from '/src/utils';

export const jettonMinterContractSelector = selector({
  key: 'jettonMinterContractSelector',
  get: async ({ get }) => {
    const address = get(jettonMinterAddressAtom);
    const tonClient = get(tonClientSelector);
    if (!address || !tonClient) return;
    const minterAddress = getAddress(address);
    if (!minterAddress) {
      throw 'invalid jetton minter address';
    }
    const contract = new Jetton(minterAddress);
    return tonClient.open(contract) as OpenedContract<Jetton>;
  },
});
