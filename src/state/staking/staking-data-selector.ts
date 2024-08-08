import { selectorFamily } from 'recoil';
import { stakingContractSelector } from './staking-contract-selector';
import { StakingParams } from '/src/contracts/StakingMinter';
import { instanceOfStakingData } from '/src/types';

export const stakingDataSelector = selectorFamily({
  key: 'stakingDataSelector',
  get:
    (address?: string) =>
    async ({ get }) => {
      const openedContract = get(stakingContractSelector(address));
      let data: StakingParams | undefined = undefined;
      try {
        data = await openedContract?.getStakingData();
      } catch (error) {}
      if (openedContract && !instanceOfStakingData(data)) {
        throw 'corrupted-staking-data';
      }
      return data;
    },
});
