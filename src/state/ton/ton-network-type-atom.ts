import { CHAIN } from '@tonconnect/ui-react';
import { atom } from 'recoil';

export const tonNetworkTypeAtom = atom<CHAIN>({
  key: 'tonNetworkTypeAtom',
  // default: CHAIN.TESTNET,
  default: CHAIN.MAINNET,
});
