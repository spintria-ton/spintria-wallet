import { Address, toNano } from '@ton/core';
import { useState } from 'react';
import { useParams } from 'react-router';
import { DEFAULT_DECIMAL_PLACES } from '../constants';
import { JettonWallet } from '../contracts/JettonWallet';
import { StakingMinter } from '../contracts/StakingMinter';
import { jettonDataSelector, tonClientSelector } from '../state';
import { toUnits } from '../state/staking/units';
import { RouteParams } from '../types';
import { getAddress, waitForSeqno } from '../utils';
import { useLoadable } from './useLoadable';
import { useTonConnect } from './useTonConnect';

export function useProvideStake() {
  const { address } = useParams<RouteParams>();
  const [amount, setAmount] = useState('');
  const { sender, wallet } = useTonConnect();
  const [sendingTx, setSendingTx] = useState(false);
  const [closeForm, setCloseForm] = useState(false);
  const client = useLoadable(tonClientSelector);
  const userPrimaryJetton = useLoadable(jettonDataSelector);

  return {
    amount,
    setAmount,
    sendingTx,
    closeForm,
    sendProvideStakeAction: async () => {
      if (
        !client ||
        !wallet ||
        !address ||
        !userPrimaryJetton ||
        !userPrimaryJetton.jettonWalletAddress
      ) {
        return;
      }
      const stakingMinterAddress = getAddress(address);
      const userPrimaryWalletAddress = getAddress(userPrimaryJetton.jettonWalletAddress);
      if (!userPrimaryWalletAddress || !stakingMinterAddress) {
        return;
      }
      const decimals = userPrimaryJetton.content?.decimals
        ? Number(userPrimaryJetton.content.decimals)
        : DEFAULT_DECIMAL_PLACES;
      const jettonAmount = toUnits(amount, decimals);

      setSendingTx(true);

      const waiter = await waitForSeqno(client, Address.parse(wallet));
      const forwardTonAmount = toNano(0.06); // 0.056 is eligible but we set little bit more
      let senderFail = false;
      try {
        await sender?.send({
          to: userPrimaryWalletAddress,
          value: forwardTonAmount + toNano(0.06),
          body: JettonWallet.transferMessage(
            jettonAmount,
            stakingMinterAddress,
            sender.address!,
            null,
            forwardTonAmount,
            StakingMinter.provideStake(
              forwardTonAmount + toNano(0.06),
              sender.address!,
              forwardTonAmount,
            ),
          ),
        });
      } catch (error) {
        senderFail = true;
      }

      if (senderFail) {
        return setSendingTx(false);
      }

      try {
        await waiter();
      } catch (error) {}

      setSendingTx(false);
      setCloseForm(true);
    },
  };
}
