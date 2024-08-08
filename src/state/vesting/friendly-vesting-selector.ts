import { selectorFamily } from 'recoil';
import { vestingDataSelector } from './vesting-data-selector';
import { JettonDataSelectorProps, vestingJettonDataSelector } from './vesting-jetton-data-selector';
import { NOW } from '/src/constants';
import { JettonWithMetadata, VestingData } from '/src/types';

const friendlyVesting = (data?: VestingData, jetton?: JettonWithMetadata) => {
  if (!data) throw 'vesting-data-undefined';
  if (!jetton) throw 'jetton-data-undefined';
  if (!data || !jetton) return;
  const { startTime, totalDuration, unlockPeriod } = data;
  const diff = NOW() - startTime;
  const periods = totalDuration / unlockPeriod;
  const currentPeriod = Math.floor(diff / unlockPeriod);
  const nextPeriod = startTime + (currentPeriod + 1) * unlockPeriod;
  const currentPercent = Number(((periods / 100) * currentPeriod).toFixed(1));
  return {
    data,
    jetton,
    periods,
    diff,
    currentPeriod,
    currentPercent: currentPercent < 100 ? currentPercent : 100,
    nextPeriod,
    isFinished: startTime + totalDuration < nextPeriod,
  };
};

export const friendlyVestingSelector = selectorFamily({
  key: 'friendlyVestingSelector',
  get:
    ({ address }: JettonDataSelectorProps) =>
    async ({ get }) => {
      const data = get(vestingDataSelector(address));
      const jettonData = get(vestingJettonDataSelector({ address }));
      if (data && jettonData) {
        return friendlyVesting(data, jettonData);
      }
    },
});
