import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { JettonDataAtom, jettonDataSelector, tonconnectWalletAddressAtom } from '../state';

export function usePrimaryWallet() {
  const wallet = useRecoilValue(tonconnectWalletAddressAtom);
  const [jettonData, setJettonData] = useState<JettonDataAtom>();
  const { state, contents } = useRecoilValueLoadable(jettonDataSelector);

  useEffect(() => {
    if (state === 'hasValue' && contents) {
      setJettonData(contents);
    }
  }, [state, contents]);

  return { wallet, jettonData, state };
}
