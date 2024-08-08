import { selectorFamily } from 'recoil';
import { stakingContractSelector } from './staking-contract-selector';
import { stakingWalletContractSelector } from './staking-wallet-contract-selector';
import { getAddress } from '/src/utils';

export type StakingJettonWalletData = {
  address: string | undefined;
  balance: bigint | undefined;
  stakeAt: number | undefined;
};

export const stakingJettonWalletSelector = selectorFamily({
  key: 'stakingJettonWalletSelector',
  get:
    ({ address, wallet }: { address?: string; wallet?: string }) =>
    async ({ get }) => {
      const minterContract = get(stakingContractSelector(address));
      if (!wallet) return;

      const walletAddress = getAddress(wallet);
      if (!walletAddress) return;

      let data: StakingJettonWalletData = {
        address: undefined,
        balance: undefined,
        stakeAt: undefined,
      };
      try {
        const jettonAdress = await minterContract?.getWalletAddress(walletAddress);
        if (!jettonAdress) return;
        data.address = jettonAdress.toString();

        const walletContract = get(stakingWalletContractSelector(jettonAdress.toString()));
        if (!walletContract) return;

        const wd = await walletContract?.getWalletData();
        data.balance = wd.balance;

        try {
          data.stakeAt = await walletContract?.getStakeAt();
        } catch (error) {}
      } catch (err) {
        console.debug('staking jetton wallet selector error');
      }
      return data;
    },
});
