import { ColorPaletteProp } from '@mui/joy';
import { Address, Cell } from '@ton/core';
import { StakingParams } from './contracts/StakingMinter';

type Modify<T, R> = Omit<T, keyof R> & R;

export const appLanguages = ['en', 'ru'] as const;
export type Language = (typeof appLanguages)[number];

export type RouteParams = {
  root?: string;
  address?: string;
};

export const durationTypes = ['hour', 'day', 'week', 'month'];
export type DurationType = (typeof durationTypes)[number];
export type LinearVestingForm = {
  ownerAddress: string;
  adminAddress: string;
  startTime: string;
  totalDuration: number;
  totalDurationType: DurationType;
  unlockPeriod: number;
  unlockPeriodType: DurationType;
  cliffDuration: number;
  cliffDurationType: DurationType;
};

// export type LinearVestingConfig = {
//   start_time: number;
//   total_duration: number;
//   unlock_period: number;
//   cliff_duration: number;
//   owner_address: Address;
// };

export type FormHelperTextMessage = {
  message: string;
  color: ColorPaletteProp;
};

export interface JettonMetadata {
  name: string;
  symbol: string;
  description?: string;
  decimals?: number | string;
  image?: string;
  image_data?: string;
  uri?: string;
}

export type JettonData = {
  totalSupply: bigint;
  mintable: boolean;
  adminAddress: Address;
  content: Cell;
  walletCode: Cell;
};

export type JettonWithMetadata = Modify<JettonData, { content: JettonMetadata | undefined }>;
export type VestingData = {
  startTime: number;
  totalDuration: number;
  unlockPeriod: number;
  cliffDuration: number;
};

export function instanceOfJettonData(o: unknown): o is JettonData {
  return (
    !!o &&
    typeof o === 'object' &&
    'totalSupply' in o &&
    'mintable' in o &&
    'adminAddress' in o &&
    'content' in o &&
    'walletCode' in o
  );
}

export function instanceOfJettonMetadata(o: unknown): o is JettonMetadata {
  return !!o && typeof o === 'object' && 'name' in o && 'symbol' in o && 'image' in o;
}

export function instanceOfVestingData(o: unknown): o is VestingData {
  return (
    !!o &&
    typeof o === 'object' &&
    'startTime' in o &&
    'totalDuration' in o &&
    'unlockPeriod' in o &&
    'cliffDuration' in o
  );
}

export function instanceOfStakingData(o: unknown): o is StakingParams {
  return (
    !!o &&
    typeof o === 'object' &&
    'lockup' in o &&
    'min_stake' in o &&
    'max_stake' in o &&
    'max_total' in o &&
    'reward_pool' in o &&
    'fixed_apy' in o
  );
}

export interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}
