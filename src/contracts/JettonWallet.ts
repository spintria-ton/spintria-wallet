import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider } from '@ton/core';
import { Op } from './JettonConstants';
import { endParse } from './JettonMinter';

export type JettonWalletConfig = {
  ownerAddress: Address;
  jettonMasterAddress: Address;
};

export function jettonWalletConfigToCell(config: JettonWalletConfig): Cell {
  return beginCell()
    .storeUint(0, 4) // status
    .storeCoins(0) // jetton balance
    .storeAddress(config.ownerAddress)
    .storeAddress(config.jettonMasterAddress)
    .endCell();
}

export function parseJettonWalletData(data: Cell) {
  const sc = data.beginParse();
  const parsed = {
    status: sc.loadUint(4),
    balance: sc.loadCoins(),
    ownerAddress: sc.loadAddress(),
    jettonMasterAddress: sc.loadAddress(),
  };
  endParse(sc);
  return parsed;
}

export class JettonWallet implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new JettonWallet(address);
  }

  static createFromConfig(config: JettonWalletConfig, code: Cell, workchain = 0) {
    const data = jettonWalletConfigToCell(config);
    const init = { code, data };
    return new JettonWallet(contractAddress(workchain, init), init);
  }

  static transferMessage(
    jetton_amount: bigint,
    to: Address,
    responseAddress: Address | null,
    customPayload: Cell | null,
    forward_ton_amount: bigint,
    forwardPayload: Cell | null,
  ) {
    return beginCell()
      .storeUint(Op.transfer, 32)
      .storeUint(0, 64) // op, queryId
      .storeCoins(jetton_amount)
      .storeAddress(to)
      .storeAddress(responseAddress)
      .storeMaybeRef(customPayload)
      .storeCoins(forward_ton_amount)
      .storeMaybeRef(forwardPayload)
      .endCell();
  }

  static burnMessage(
    jetton_amount: bigint,
    responseAddress: Address | null,
    customPayload: Cell | null,
  ) {
    return beginCell()
      .storeUint(Op.burn, 32)
      .storeUint(0, 64) // op, queryId
      .storeCoins(jetton_amount)
      .storeAddress(responseAddress)
      .storeMaybeRef(customPayload)
      .endCell();
  }
  async getWalletData(provider: ContractProvider) {
    let { stack } = await provider.get('get_wallet_data', []);
    return {
      balance: stack.readBigNumber(),
      owner: stack.readAddress(),
      minter: stack.readAddress(),
      wallet_code: stack.readCell(),
    };
  }
  async getJettonBalance(provider: ContractProvider) {
    let state = await provider.getState();
    if (state.state.type !== 'active') {
      return 0n;
    }
    let res = await provider.get('get_wallet_data', []);
    return res.stack.readBigNumber();
  }
  async getStakeAt(provider: ContractProvider) {
    let res = await provider.get('get_stake_at', []);
    return res.stack.readNumber();
  }
}
