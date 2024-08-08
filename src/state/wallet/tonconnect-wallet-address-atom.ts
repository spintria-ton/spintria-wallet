import { atom } from 'recoil';

export const tonconnectWalletAddressAtom = atom<string | undefined>({
  key: 'tonconnectWalletAddressAtom',
  default: undefined,
});
