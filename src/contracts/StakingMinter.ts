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

export type StakingMinterContent = {
  uri: string;
};
export type StakingParams = {
  lockup: number;
  min_stake: bigint;
  max_stake: bigint;
  max_total: bigint;
  reward_pool: bigint;
  fixed_apy: bigint;
};
export type StakingMinterConfig = {
  admin: Address;
  wallet_code: Cell;
  jetton_content: Cell | StakingMinterContent;
  staking_params?: Cell | StakingParams;
};
export type StakingMinterConfigFull = {
  supply: bigint;
  admin: Address;
  //Makes no sense to update transfer admin. ...Or is it?
  transfer_admin: Address | null;
  primary_jetton_wallet: Address | null;
  wallet_code: Cell;
  jetton_content: Cell | StakingMinterContent;
  staking_params?: Cell | StakingParams;
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

export function jettonMinterConfigCellToConfig(config: Cell): StakingMinterConfigFull {
  const sc = config.beginParse();
  const parsed: StakingMinterConfigFull = {
    supply: sc.loadCoins(),
    admin: sc.loadAddress(),
    transfer_admin: sc.loadMaybeAddress(),
    primary_jetton_wallet: sc.loadMaybeAddress(),
    wallet_code: sc.loadRef(),
    jetton_content: sc.loadRef(),
    staking_params: sc.loadRef(),
  };
  endParse(sc);
  return parsed;
}

export function parseStakingMinterData(data: Cell): StakingMinterConfigFull {
  return jettonMinterConfigCellToConfig(data);
}

export function jettonMinterConfigFullToCell(config: StakingMinterConfigFull): Cell {
  const content =
    config.jetton_content instanceof Cell
      ? config.jetton_content
      : jettonContentToCell(config.jetton_content);
  if (config.staking_params) {
    const stakingParams =
      config.staking_params instanceof Cell
        ? config.staking_params
        : stakingParamsToCell(config.staking_params);
    return beginCell()
      .storeCoins(config.supply)
      .storeAddress(config.admin)
      .storeAddress(config.transfer_admin)
      .storeAddress(null) // Primary jetton address
      .storeRef(config.wallet_code)
      .storeRef(content)
      .storeRef(stakingParams)
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

export function jettonMinterConfigToCell(config: StakingMinterConfig): Cell {
  const content =
    config.jetton_content instanceof Cell
      ? config.jetton_content
      : jettonContentToCell(config.jetton_content);
  if (config.staking_params) {
    const stakingParams =
      config.staking_params instanceof Cell
        ? config.staking_params
        : stakingParamsToCell(config.staking_params);
    return beginCell()
      .storeCoins(0)
      .storeAddress(config.admin)
      .storeAddress(null) // Transfer admin address
      .storeAddress(null) // Primary jetton address
      .storeRef(config.wallet_code)
      .storeRef(content)
      .storeRef(stakingParams)
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

export function jettonContentToCell(content: StakingMinterContent) {
  return beginCell()
    .storeStringRefTail(content.uri) //Snake logic under the hood
    .endCell();
}

export function stakingParamsToCell(params: StakingParams) {
  return beginCell()
    .storeUint(params.lockup, 16)
    .storeCoins(params.min_stake)
    .storeCoins(params.max_stake)
    .storeCoins(params.max_total)
    .storeCoins(params.reward_pool)
    .storeCoins(params.fixed_apy)
    .endCell();
}

export class StakingMinter implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new StakingMinter(address);
  }

  static createFromConfig(config: StakingMinterConfig, code: Cell, workchain = 0) {
    const data = jettonMinterConfigToCell(config);
    const init = { code, data };
    return new StakingMinter(contractAddress(workchain, init), init);
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
      body: StakingMinter.discoveryMessage(owner, include_address),
      value: value,
    });
  }

  static provideRewardPoolMessage() {
    return beginCell().storeUint(Op.provide_reward_pool, 32).endCell();
  }

  static provideStake(
    ton_amount: bigint = toNano('0.1'),
    response_address: Address | null = null,
    forward_ton_amount: bigint = toNano('0.05'),
  ) {
    return beginCell()
      .storeUint(Op.provide_stake, 32)
      .storeCoins(ton_amount)
      .storeAddress(response_address)
      .storeCoins(forward_ton_amount)
      .endCell();
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

  async getTotalSupply(provider: ContractProvider) {
    let res = await this.getJettonData(provider);
    return res.totalSupply;
  }

  async getContent(provider: ContractProvider) {
    let res = await this.getJettonData(provider);
    return res.content;
  }

  async getStakingData(provider: ContractProvider): Promise<StakingParams> {
    const res = await provider.get('get_staking_data', []);
    const lockup = res.stack.readNumber();
    const min_stake = res.stack.readBigNumber();
    const max_stake = res.stack.readBigNumber();
    const max_total = res.stack.readBigNumber();
    const reward_pool = res.stack.readBigNumber();
    const fixed_apy = res.stack.readBigNumber();
    return { lockup, min_stake, max_stake, max_total, reward_pool, fixed_apy };
  }
}
