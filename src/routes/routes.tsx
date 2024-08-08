import { Route, Routes as RouterRoutes } from 'react-router';

import { useTonWallet } from '@tonconnect/ui-react';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { PrimaryWallet } from '../components/primary-wallet';
import { StakingMinter } from '../components/staking-minter';
import { tonconnectWalletAddressAtom } from '../state';
import { VestingMinter, Workspace } from '/src/components';

export const Routes = () => {
  const wallet = useTonWallet();
  const setTonconnectWalletAddress = useSetRecoilState(tonconnectWalletAddressAtom);

  useEffect(() => {
    setTonconnectWalletAddress(wallet?.account.address);
  }, [wallet]);

  return (
    <RouterRoutes>
      <Route path=":root" element={<Workspace />}>
        <Route index element={<PrimaryWallet />} />
        <Route path="vesting/:address" element={<VestingMinter />} />
        <Route path="vesting" element={<VestingMinter />} />
        <Route path="staking/:address" element={<StakingMinter />} />
        <Route path="staking" element={<StakingMinter />} />
      </Route>
    </RouterRoutes>
  );
};
