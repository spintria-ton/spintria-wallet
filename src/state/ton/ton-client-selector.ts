import { Network, getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from '@ton/ton';
import { CHAIN } from '@tonconnect/ui-react';
import { selector } from 'recoil';
import { tonNetworkTypeAtom } from './ton-network-type-atom';

const getTonClient = async (network: Network) =>
  new TonClient({ endpoint: await getHttpEndpoint({ network }) });

export const tonClientSelector = selector({
  key: 'tonClientSelector',
  get: async ({ get }) => {
    const chainType = get(tonNetworkTypeAtom);
    if (!chainType) throw 'chain-type-undefined';
    return getTonClient(chainType === CHAIN.MAINNET ? 'mainnet' : 'testnet');
  },
});
