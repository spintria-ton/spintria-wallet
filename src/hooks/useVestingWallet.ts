import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { vestingJettonWalletSelector } from '../state/vesting/vesting-jetton-wallet-selector';
import { RouteParams } from '../types';
import { useLoadable } from './useLoadable';
import { friendlyVestingSelector, tonconnectWalletAddressAtom } from '/src/state';

export function useVestingWallet() {
  const { address } = useParams<RouteParams>();
  const wallet = useRecoilValue(tonconnectWalletAddressAtom);
  const friendlyVesting = useLoadable(friendlyVestingSelector({ address }));
  const vestingJetton = useLoadable(vestingJettonWalletSelector({ address }));

  return { friendlyVesting, wallet, vestingJetton };
}
