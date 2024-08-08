import { selectorFamily } from 'recoil';
import { tonconnectWalletAddressAtom } from '../wallet';
import { vestingContractSelector } from './vesting-contract-selector';
import { vestingWalletContractSelector } from './vesting-wallet-contract-selector';
import { getAddress } from '/src/utils';

export const vestingJettonWalletSelector = selectorFamily({
  key: 'vestingJettonWalletSelector',
  get:
    ({ address }: { address?: string }) =>
    async ({ get }) => {
      const minterContract = get(vestingContractSelector(address));
      const wallet = get(tonconnectWalletAddressAtom);
      if (!wallet) {
        return;
      }
      const walletAddress = getAddress(wallet);
      if (!walletAddress) {
        return;
      }
      let balance: bigint | undefined;
      try {
        const jettonAdress = await minterContract?.getWalletAddress(walletAddress);
        if (!jettonAdress) return;

        const walletContract = get(vestingWalletContractSelector(jettonAdress.toString()));
        if (!walletContract) return;

        const walletData = await walletContract?.getWalletData();
        balance = walletData.balance;
      } catch (err) {
        console.debug('vesting jetton wallet selector error');
      }
      return { balance };
    },
});
