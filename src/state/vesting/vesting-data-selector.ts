import { selectorFamily } from 'recoil';
import { vestingContractSelector } from './vesting-contract-selector';
import { VestingData, instanceOfVestingData } from '/src/types';

export const vestingDataSelector = selectorFamily({
  key: 'vestingDataSelector',
  get:
    (address?: string) =>
    async ({ get }) => {
      const openedContract = get(vestingContractSelector(address));
      let data: VestingData | undefined = undefined;
      try {
        data = await openedContract?.getVestingData();
      } catch (error) {}
      if (openedContract && !instanceOfVestingData(data)) {
        throw 'corrupted-vesting-data';
      }
      return data;
    },
});
