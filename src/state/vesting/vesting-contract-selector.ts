import { OpenedContract } from '@ton/core';
import { selectorFamily } from 'recoil';
import { tonClientSelector } from '../ton';
import { VestingMinter } from '/src/contracts';
import { getAddress } from '/src/utils';

export const vestingContractSelector = selectorFamily({
  key: 'vestingContractSelector',
  get:
    (addr?: string) =>
    async ({ get }) => {
      if (!addr) return;

      const tonClient = get(tonClientSelector);
      if (!tonClient) return;

      const address = getAddress(addr);
      if (!address) {
        throw 'invalid vesting address';
      }

      const contract = new VestingMinter(address);
      return tonClient.open(contract) as OpenedContract<VestingMinter>;
    },
});
