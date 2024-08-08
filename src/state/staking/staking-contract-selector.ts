import { OpenedContract } from '@ton/core';
import { selectorFamily } from 'recoil';
import { tonClientSelector } from '../ton';
import { StakingMinter } from '/src/contracts/StakingMinter';
import { getAddress } from '/src/utils';

export const stakingContractSelector = selectorFamily({
  key: 'stakingContractSelector',
  get:
    (addr?: string) =>
    async ({ get }) => {
      if (!addr) return;

      const tonClient = get(tonClientSelector);
      if (!tonClient) return;

      const address = getAddress(addr);
      if (!address) {
        throw 'invalid staking address';
      }

      const contract = new StakingMinter(address);
      return tonClient.open(contract) as OpenedContract<StakingMinter>;
    },
});
