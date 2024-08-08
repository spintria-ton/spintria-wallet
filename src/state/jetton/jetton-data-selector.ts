import { fromNano } from '@ton/core';
import { selector } from 'recoil';
import { tonconnectWalletAddressAtom } from '../wallet';
import { jettonMinterContractSelector } from './jetton-minter-contract-selector';
import { jettonWalletContractSelector } from './jetton-wallet-contract-selector';
import { getJettonMetadata } from '/src/metadata';
import { JettonMetadata } from '/src/types';
import { getAddress } from '/src/utils';

export type JettonDataAtom = {
  adminAddress: string;
  jettonWalletAddress: string | undefined;
  content?: JettonMetadata;
  mintable: boolean;
  totalSupply: string;
  balance?: bigint;
};

export const jettonDataSelector = selector({
  key: 'jettonDataSelector',
  get: async ({ get }) => {
    const openedContract = get(jettonMinterContractSelector);
    let balance: bigint | undefined;
    let jettonWalletAddress: string | undefined;
    try {
      const wallet = get(tonconnectWalletAddressAtom);
      if (!wallet) return;

      const data = await openedContract?.getJettonData();
      if (!data) return;

      const walletAddress = getAddress(wallet);
      if (!walletAddress) return;

      const jettonAdress = await openedContract?.getWalletAddress(walletAddress);
      if (!jettonAdress) return;
      jettonWalletAddress = jettonAdress;

      try {
        const walletContract = get(jettonWalletContractSelector(jettonAdress.toString()));
        if (!walletContract) return;

        const walletData = await walletContract?.getWalletData();
        balance = walletData.balance;
      } catch (err) {
        console.debug('primary jetton wallet selector error');
      }

      const jettonData: JettonDataAtom = {
        adminAddress: data.adminAddress.toString(),
        jettonWalletAddress,
        content: await getJettonMetadata(data.content),
        mintable: data.mintable,
        totalSupply: fromNano(data.totalSupply),
        balance,
      };
      return jettonData;
    } catch (err) {}
  },
});
