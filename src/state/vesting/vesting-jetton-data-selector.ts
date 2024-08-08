import { selectorFamily } from 'recoil';
import { vestingContractSelector } from './vesting-contract-selector';
import rawJson from './vesting-jetton-meta-data.json';
import { getJettonMetadata } from '/src/metadata';
import { JettonData, instanceOfJettonData, instanceOfJettonMetadata } from '/src/types';

export type JettonDataSelectorProps = {
  address?: string;
};

export const vestingJettonDataSelector = selectorFamily({
  key: 'vestingJettonDataSelector',
  get:
    ({ address }: JettonDataSelectorProps) =>
    async ({ get }) => {
      const minterContract = get(vestingContractSelector(address));
      let data: JettonData | undefined;
      try {
        data = await minterContract?.getJettonData();
      } catch (err) {}
      if (!data) {
        throw 'jetton-data-undefined';
      }
      if (minterContract && !instanceOfJettonData(data)) {
        throw 'corrupted-jetton-data';
      }
      let content = await getJettonMetadata(data.content);

      // NOTE: shitty CORS
      // if (content?.uri) {
      //   const response = await fetch(content?.uri, {
      //     method: 'GET',
      //     headers: { 'Content-Type': 'application/json' },
      //   });
      //   const rawJson = response.json();
      //   if (instanceOfJettonMetadata(rawJson)) content = rawJson;
      // }
      if (content?.uri && instanceOfJettonMetadata(rawJson)) {
        content = rawJson;
      }
      return { ...data, content };
    },
});
