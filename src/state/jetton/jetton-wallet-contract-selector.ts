import { OpenedContract } from '@ton/core';
import { selectorFamily } from 'recoil';
import { tonClientSelector } from '../ton';
import { JettonWallet } from '/src/contracts/JettonWallet';
import { getAddress } from '/src/utils';

export const jettonWalletContractSelector = selectorFamily({
  key: 'jettonWalletContractSelector',
  get:
    (addr?: string) =>
    async ({ get }) => {
      if (!addr) return;

      const tonClient = get(tonClientSelector);
      if (!tonClient) return;

      const address = getAddress(addr);
      if (!address) {
        throw 'invalid jetton wallet address';
      }

      const contract = new JettonWallet(address);
      return tonClient.open(contract) as OpenedContract<JettonWallet>;
    },
});
