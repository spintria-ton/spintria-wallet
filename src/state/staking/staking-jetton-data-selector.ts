import { selectorFamily } from 'recoil';
import { stakingContractSelector } from './staking-contract-selector';
import defaultRawJson from './staking-jetton-meta-data.json';
import { getJettonMetadata } from '/src/metadata';
import { JettonData, instanceOfJettonData, instanceOfJettonMetadata } from '/src/types';

export type JettonDataSelectorProps = {
  address?: string;
};

const uris = [
  '/staking/jetton-6.json',
  '/staking/jetton-9.json',
  '/staking/jetton-12.json',
  '/staking/jetton-15.json',
  '/staking/jetton-18.json',
  '/staking-test/jetton-6.json',
  '/staking-test/jetton-9.json',
  '/staking-test/jetton-12.json',
  '/staking-test/jetton-15.json',
  '/staking-test/jetton-18.json',
];

export const stakingJettonDataSelector = selectorFamily({
  key: 'stakingJettonDataSelector',
  get:
    ({ address }: JettonDataSelectorProps) =>
    async ({ get }) => {
      const minterContract = get(stakingContractSelector(address));
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
      if (content?.uri) {
        let uriToFetch = content.uri;
        const foundedUri = uris.find((f) => content?.uri?.indexOf(f) !== -1);
        if (foundedUri) {
          uriToFetch = foundedUri;
        }
        try {
          const response = await fetch(uriToFetch, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const rawJson = await response.json();
          if (instanceOfJettonMetadata(rawJson)) {
            content = rawJson;
          }
        } catch (err) {
          if (instanceOfJettonMetadata(defaultRawJson)) {
            content = defaultRawJson;
          }
        }
      }

      return {
        adminAddress: data.adminAddress.toString(),
        content,
        mintable: data.mintable,
        totalSupply: data.totalSupply,
      };
    },
});
