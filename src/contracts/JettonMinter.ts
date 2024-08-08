import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  Slice,
  toNano,
} from '@ton/core';
import { Op } from './JettonConstants';

export type JettonMinterContent = {
  uri: string;
};
export type JettonMinterConfig = {
  admin: Address;
  wallet_code: Cell;
  jetton_content: Cell | JettonMinterContent;
};
export type JettonMinterConfigFull = {
  supply: bigint;
  admin: Address;
  //Makes no sense to update transfer admin. ...Or is it?
  transfer_admin: Address | null;
  wallet_code: Cell;
  jetton_content: Cell | JettonMinterContent;
};

export type LockType = 'unlock' | 'out' | 'in' | 'full';

export const LOCK_TYPES = ['unlock', 'out', 'in', 'full'];

export const lockTypeToInt = (lockType: LockType): number => {
  switch (lockType) {
    case 'unlock':
      return 0;
    case 'out':
      return 1;
    case 'in':
      return 2;
    case 'full':
      return 3;
    default:
      throw new Error('Invalid argument!');
  }
};

export const intToLockType = (lockType: number): LockType => {
  switch (lockType) {
    case 0:
      return 'unlock';
    case 1:
      return 'out';
    case 2:
      return 'in';
    case 3:
      return 'full';
    default:
      throw new Error('Invalid argument!');
  }
};

export function endParse(slice: Slice) {
  if (slice.remainingBits > 0 || slice.remainingRefs > 0) {
    throw new Error('remaining bits in data');
  }
}

export function jettonMinterConfigCellToConfig(config: Cell): JettonMinterConfigFull {
  const sc = config.beginParse();
  const parsed: JettonMinterConfigFull = {
    supply: sc.loadCoins(),
    admin: sc.loadAddress(),
    transfer_admin: sc.loadMaybeAddress(),
    wallet_code: sc.loadRef(),
    jetton_content: sc.loadRef(),
  };
  endParse(sc);
  return parsed;
}

export function parseJettonMinterData(data: Cell): JettonMinterConfigFull {
  return jettonMinterConfigCellToConfig(data);
}

export function jettonMinterConfigFullToCell(config: JettonMinterConfigFull): Cell {
  const content =
    config.jetton_content instanceof Cell
      ? config.jetton_content
      : jettonContentToCell(config.jetton_content);
  return beginCell()
    .storeCoins(config.supply)
    .storeAddress(config.admin)
    .storeAddress(config.transfer_admin)
    .storeRef(config.wallet_code)
    .storeRef(content)
    .endCell();
}

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
  const content =
    config.jetton_content instanceof Cell
      ? config.jetton_content
      : jettonContentToCell(config.jetton_content);
  return beginCell()
    .storeCoins(0)
    .storeAddress(config.admin)
    .storeAddress(null) // Transfer admin address
    .storeRef(config.wallet_code)
    .storeRef(content)
    .endCell();
}

export function jettonContentToCell(content: JettonMinterContent) {
  return beginCell()
    .storeStringRefTail(content.uri) //Snake logic under the hood
    .endCell();
}

export class JettonMinter implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new JettonMinter(address);
  }

  static createFromConfig(config: JettonMinterConfig, code: Cell, workchain = 0) {
    const data = jettonMinterConfigToCell(config);
    const init = { code, data };
    return new JettonMinter(contractAddress(workchain, init), init);
  }

  static topUpMessage() {
    return beginCell()
      .storeUint(Op.top_up, 32)
      .storeUint(0, 64) // op, queryId
      .endCell();
  }
  /* provide_wallet_address#2c76b973 query_id:uint64 owner_address:MsgAddress include_address:Bool = InternalMsgBody;
   */
  static discoveryMessage(owner: Address, include_address: boolean) {
    return beginCell()
      .storeUint(Op.provide_wallet_address, 32)
      .storeUint(0, 64) // op, queryId
      .storeAddress(owner)
      .storeBit(include_address)
      .endCell();
  }

  async sendDiscovery(
    provider: ContractProvider,
    via: Sender,
    owner: Address,
    include_address: boolean,
    value: bigint = toNano('0.1'),
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: JettonMinter.discoveryMessage(owner, include_address),
      value: value,
    });
  }

  async getWalletAddress(provider: ContractProvider, owner: Address): Promise<Address> {
    const res = await provider.get('get_wallet_address', [
      {
        type: 'slice',
        cell: beginCell().storeAddress(owner).endCell(),
      },
    ]);
    return res.stack.readAddress();
  }

  async getJettonData(provider: ContractProvider) {
    let res = await provider.get('get_jetton_data', []);
    let totalSupply = res.stack.readBigNumber();
    let mintable = res.stack.readBoolean();
    let adminAddress = res.stack.readAddress();
    let content = res.stack.readCell();
    let walletCode = res.stack.readCell();
    return {
      totalSupply,
      mintable,
      adminAddress,
      content,
      walletCode,
    };
  }

  async getVestingData(provider: ContractProvider) {
    const result = await provider.get('get_vesting_data', []);
    return {
      startTime: result.stack.readNumber(),
      totalDuration: result.stack.readNumber(),
      unlockPeriod: result.stack.readNumber(),
      cliffDuration: result.stack.readNumber(),
    };
  }

  async getTotalSupply(provider: ContractProvider) {
    let res = await this.getJettonData(provider);
    return res.totalSupply;
  }
}
