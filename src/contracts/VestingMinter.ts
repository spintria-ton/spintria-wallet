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
import { JettonData, VestingData } from '../types';
import { Op } from './JettonConstants';
import { VestingWallet } from './VestingWallet';

export type JettonMinterContent = {
  uri: string;
};
export type VestingParams = {
  start_time: number;
  total_duration: number;
  unlock_period: number;
  cliff_duration: number;
};
export type JettonMinterConfig = {
  admin: Address;
  wallet_code: Cell;
  jetton_content: Cell | JettonMinterContent;
  vesting_params?: Cell | VestingParams;
};
export type JettonMinterConfigFull = {
  supply: bigint;
  admin: Address;
  //Makes no sense to update transfer admin. ...Or is it?
  transfer_admin: Address | null;
  wallet_code: Cell;
  jetton_content: Cell | JettonMinterContent;
  vesting_params?: Cell | VestingParams;
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
    vesting_params: sc.loadRef(),
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
  if (config.vesting_params) {
    const vestingParams =
      config.vesting_params instanceof Cell
        ? config.vesting_params
        : vestingParamsToCell(config.vesting_params);
    return beginCell()
      .storeCoins(config.supply)
      .storeAddress(config.admin)
      .storeAddress(config.transfer_admin)
      .storeAddress(null) // Primary jetton address
      .storeRef(config.wallet_code)
      .storeRef(content)
      .storeRef(vestingParams)
      .endCell();
  }
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
  if (config.vesting_params) {
    const vestingParams =
      config.vesting_params instanceof Cell
        ? config.vesting_params
        : vestingParamsToCell(config.vesting_params);
    return beginCell()
      .storeCoins(0)
      .storeAddress(config.admin)
      .storeAddress(null) // Transfer admin address
      .storeAddress(null) // Primary jetton address
      .storeRef(config.wallet_code)
      .storeRef(content)
      .storeRef(vestingParams)
      .endCell();
  }
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

export function vestingParamsToCell(params: VestingParams) {
  return beginCell()
    .storeUint(params.start_time, 64)
    .storeUint(params.total_duration, 32)
    .storeUint(params.unlock_period, 32)
    .storeUint(params.cliff_duration, 32)
    .endCell();
}

export class VestingMinter implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new VestingMinter(address);
  }

  static createFromConfig(config: JettonMinterConfig, code: Cell, workchain = 0) {
    const data = jettonMinterConfigToCell(config);
    const init = { code, data };
    return new VestingMinter(contractAddress(workchain, init), init);
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
      body: VestingMinter.discoveryMessage(owner, include_address),
      value: value,
    });
  }

  static refundMessage(value: bigint = toNano('0.1'), query_id: bigint | number = 0) {
    return beginCell()
      .storeUint(Op.refund, 32)
      .storeUint(query_id, 64)
      .storeCoins(value)
      .storeRef(VestingWallet.clawbackMessage(null))
      .endCell();
  }
  async sendRefund(
    provider: ContractProvider,
    via: Sender,
    value: bigint = toNano('0.1'),
    query_id: bigint | number = 0,
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: VestingMinter.refundMessage(value, query_id),
      value: value + toNano('0.1'),
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

  async getJettonData(provider: ContractProvider): Promise<JettonData> {
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

  async getVestingData(provider: ContractProvider): Promise<VestingData> {
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

  async getAdminAddress(provider: ContractProvider) {
    let res = await this.getJettonData(provider);
    return res.adminAddress;
  }

  async getContent(provider: ContractProvider) {
    let res = await this.getJettonData(provider);
    return res.content;
  }

  async getNextAdminAddress(provider: ContractProvider) {
    const res = await provider.get('get_next_admin_address', []);
    return res.stack.readAddressOpt();
  }
}
