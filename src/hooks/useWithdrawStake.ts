import { Address, toNano } from '@ton/core';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useResetRecoilState } from 'recoil';
import { DEFAULT_DECIMAL_PLACES } from '../constants';
import { JettonWallet } from '../contracts/JettonWallet';
import { tonClientSelector } from '../state';
import { FriendlyStaking, friendlyStakingSelector } from '../state/staking';
import { toUnits } from '../state/staking/units';
import { RouteParams } from '../types';
import { delay, waitForSeqno } from '../utils';
import { useLoadable } from './useLoadable';
import { useTonConnect } from './useTonConnect';

export function useWithdrawStake(data?: FriendlyStaking) {
  const { address } = useParams<RouteParams>();
  const resetStakingData = useResetRecoilState(friendlyStakingSelector({ address }));
  const [amount, setAmount] = useState('');
  const { sender, wallet } = useTonConnect();
  const [sendingTx, setSendingTx] = useState(false);
  const [closeForm, setCloseForm] = useState(false);
  const client = useLoadable(tonClientSelector);

  return {
    amount,
    setAmount,
    sendingTx,
    closeForm,
    sendWithdraw: async () => {
      if (!client || !wallet || !data?.wallet.address) {
        return;
      }
      const decimals = data.jetton.content?.decimals
        ? Number(data.jetton.content?.decimals)
        : DEFAULT_DECIMAL_PLACES;
      const jettonAmount = toUnits(amount, decimals);

      setSendingTx(true);

      const waiter = await waitForSeqno(client, Address.parse(wallet));
      let senderFail = false;
      try {
        await sender?.send({
          to: data.wallet.address,
          value: toNano(0.06),
          body: JettonWallet.burnMessage(jettonAmount, sender.address!, null),
        });
      } catch (error) {
        senderFail = true;
      }

      if (senderFail) {
        return setSendingTx(false);
      }

      try {
        await waiter();
        await delay(10 * 1000);
      } catch (error) {}

      resetStakingData();
      setSendingTx(false);
      setCloseForm(true);
    },
  };
}
