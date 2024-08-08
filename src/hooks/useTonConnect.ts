import { Cell, Sender, SenderArguments, beginCell, storeStateInit } from '@ton/core';
import { CHAIN } from '@tonconnect/protocol';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  wallet?: string;
  network: CHAIN | null;
  isMainnet?: boolean;
} {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        let stateCell = new Cell();
        if (args.init) {
          stateCell = beginCell().store(storeStateInit(args.init)).endCell();
        }
        return tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              stateInit: args.init ? stateCell.toBoc().toString('base64') : undefined,
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        }) as unknown as Promise<void>;
      },
    },
    connected: !!wallet?.account.address,
    wallet: wallet?.account.address,
    network: wallet?.account.chain ?? null,
    isMainnet: wallet ? wallet?.account.chain === CHAIN.MAINNET : undefined,
  };
}
