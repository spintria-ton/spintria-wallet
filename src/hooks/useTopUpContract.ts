import { Address } from '@ton/core';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useResetRecoilState } from 'recoil';
import { TON_DECIMAL_PLACES } from '../constants';
import { JettonMinter } from '../contracts/JettonMinter';
import { jettonDataSelector, tonClientSelector } from '../state';
import { friendlyStakingSelector } from '../state/staking';
import { toUnits } from '../state/staking/units';
import { RouteParams } from '../types';
import { delay, getAddress, waitForSeqno } from '../utils';
import { useLoadable } from './useLoadable';
import { useTonConnect } from './useTonConnect';

export function useTopUpContract() {
  const { address } = useParams<RouteParams>();
  const resetStakingData = useResetRecoilState(friendlyStakingSelector({ address }));
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
    sendTopUpAction: async () => {
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
      const tonAmount = toUnits(amount, TON_DECIMAL_PLACES);

      if (!stakingMinterAddress) {
        return;
      }
      setSendingTx(true);
      const waiter = await waitForSeqno(client, Address.parse(wallet));

      let senderFail = false;
      try {
        await sender?.send({
          to: stakingMinterAddress,
          value: tonAmount,
          body: JettonMinter.topUpMessage(),
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
