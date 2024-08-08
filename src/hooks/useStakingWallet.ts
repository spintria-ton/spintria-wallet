import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { tonconnectWalletAddressAtom } from '../state';
import { FriendlyStaking, friendlyStakingSelector } from '../state/staking';
import { RouteParams } from '../types';
import { getAddress } from '../utils';

export function useStakingWallet() {
  const { address } = useParams<RouteParams>();

  const wallet = useRecoilValue(tonconnectWalletAddressAtom);
  const [data, setData] = useState<FriendlyStaking>();
  const [isAdmin, setIsAdmin] = useState(false);
  const { state, contents } = useRecoilValueLoadable(friendlyStakingSelector({ address }));

  useEffect(() => {
    if (state === 'hasError' || state === 'loading') {
      setData(undefined);
    } else if (state === 'hasValue' && contents) {
      setData(contents);
      if (wallet && contents.jetton?.adminAddress) {
        const wa = getAddress(wallet);
        const ja = contents.jetton?.adminAddress;
        if (wa && ja && wa.equals(ja)) setIsAdmin(true);
      }
    }
  }, [state, contents]);

  return { data, wallet, state, isAdmin };
}
