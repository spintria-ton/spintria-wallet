import { CHAIN } from '@tonconnect/ui-react';
import { selector } from 'recoil';
import { tonNetworkTypeAtom } from '../ton';
import { MAINNET_SPINTRIA_MASTER_ADDRESS, TESTNET_SPINTRIA_MASTER_ADDRESS } from '/src/constants';

export const jettonMinterAddressAtom = selector({
  key: 'jettonMinterAddressAtom',
  get: ({ get }) => {
    const network = get(tonNetworkTypeAtom);
    return network === CHAIN.MAINNET
      ? MAINNET_SPINTRIA_MASTER_ADDRESS
      : TESTNET_SPINTRIA_MASTER_ADDRESS;
  },
});
