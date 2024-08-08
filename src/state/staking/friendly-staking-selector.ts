import { Address, OpenedContract } from '@ton/core';
import { selectorFamily } from 'recoil';
import { tonClientSelector } from '../ton';
import { tonconnectWalletAddressAtom } from '../wallet';
import defaultRawJson from './staking-jetton-meta-data.json';
import { fromUnits } from './units';
import { DEFAULT_DECIMAL_PLACES } from '/src/constants';
import { JettonWallet } from '/src/contracts/JettonWallet';
import { StakingMinter, StakingParams } from '/src/contracts/StakingMinter';
import { getJettonMetadata, OFFCHAIN_URIS } from '/src/metadata';
import {
  instanceOfJettonData,
  instanceOfJettonMetadata,
  instanceOfStakingData,
  JettonData,
  JettonWithMetadata,
} from '/src/types';
import { getAddress } from '/src/utils';

export type JettonWalletData = {
  address: Address | undefined;
  owner: Address | undefined;
  minter: Address | undefined;
  balance: bigint | undefined;
  stakeAt: number | undefined;
};
export type FriendlyStaking = {
  balance: bigint;
  staking: StakingParams;
  jetton: JettonWithMetadata;
  wallet: JettonWalletData;
  friendly: {
    balance: string;
    totalSupply: string;
    fixedApy: string;
    maxStake: string;
    maxTotal: string;
    minStake: string;
    rewardPool: string;
  };
};

const friendlyAmount = (value?: bigint, decimals?: string | number) =>
  Number(fromUnits(value || 0n, Number(decimals || DEFAULT_DECIMAL_PLACES))).toLocaleString();

const friendlyStaking = async (
  balance: bigint,
  staking: StakingParams,
  jetton: JettonData,
  wallet: JettonWalletData,
): Promise<FriendlyStaking | undefined> => {
  let content = await getJettonMetadata(jetton.content);

  // NOTE: shitty CORS
  if (content?.uri) {
    let uriToFetch = content.uri;
    const foundedUri = OFFCHAIN_URIS.find((f) => content?.uri?.indexOf(f) !== -1);
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
    balance,
    friendly: {
      fixedApy: friendlyAmount(staking.fixed_apy, content?.decimals),
      maxStake: friendlyAmount(staking.max_stake, content?.decimals),
      maxTotal: friendlyAmount(staking.max_total, content?.decimals),
      minStake: friendlyAmount(staking.min_stake, content?.decimals),
      rewardPool: friendlyAmount(staking.reward_pool, content?.decimals),
      totalSupply: friendlyAmount(jetton.totalSupply, content?.decimals),
      balance: friendlyAmount(wallet.balance, content?.decimals),
    },
    staking,
    jetton: { ...jetton, content },
    wallet,
  };
};

export const friendlyStakingSelector = selectorFamily({
  key: 'friendlyStakingSelector',
  get:
    ({ address }: { address?: string }) =>
    async ({ get }) => {
      const wallet = get(tonconnectWalletAddressAtom);
      if (!address || !wallet) {
        return;
      }
      const contractAddress = getAddress(address);
      if (!contractAddress) {
        throw 'invalid staking-minter address';
      }
      const walletAddress = getAddress(wallet);
      if (!walletAddress) {
        throw 'invalid staking-user-wallet address';
      }
      const tonClient = get(tonClientSelector);
      if (!tonClient) {
        return;
      }
      const contract = new StakingMinter(contractAddress);
      const openedContract = tonClient.open(contract) as OpenedContract<StakingMinter>;

      let staking: StakingParams | undefined = undefined;
      let jetton: JettonData | undefined;
      let data: JettonWalletData = {
        address: undefined,
        owner: undefined,
        minter: undefined,
        balance: undefined,
        stakeAt: undefined,
      };

      try {
        staking = await openedContract?.getStakingData();
      } catch (err) {}
      if (!instanceOfStakingData(staking)) {
        throw 'corrupted-staking-data';
      }

      try {
        jetton = await openedContract?.getJettonData();
      } catch (err) {}
      if (!jetton) {
        throw 'jetton-data-undefined';
      }
      if (!instanceOfJettonData(jetton)) {
        throw 'corrupted-staking-jetton-data';
      }

      try {
        const jettonAdress = await openedContract?.getWalletAddress(walletAddress);
        if (!jettonAdress) {
          throw 'error: openedContract.getWalletAddress';
        }
        data.address = jettonAdress;

        // const walletContract = get(stakingWalletContractSelector(jettonAdress.toString()));
        const jettonWallet = new JettonWallet(jettonAdress);
        const walletContract = tonClient.open(jettonWallet) as OpenedContract<JettonWallet>;
        if (!walletContract) return;

        if (!walletContract) return;

        try {
          const walletData = await walletContract.getWalletData();
          data.minter = walletData.minter;
          data.owner = walletData.owner;
          data.balance = walletData.balance;
        } catch (error) {}

        try {
          data.stakeAt = await walletContract.getStakeAt();
        } catch (error) {}
      } catch (err) {
        console.debug('staking jetton wallet selector error');
      }

      let balance = 0n;
      // const smcAddress = getAddress(address);
      // if (!smcAddress) {
      //   throw 'invalid friendly staking address';
      // }
      // try {
      //   const tonBalance = tonClient.getBalance(smcAddress);
      // } catch (error) {
      //   console.error(error);
      // }
      if (staking && jetton && data) {
        return friendlyStaking(balance, staking, jetton, data);
      }
    },
});
