import { maskitoNumberOptionsGenerator } from '@maskito/kit';

export const START_TIME_OVERHEAD = 60 * 60 * 24 * 365 * 135;
export const NOW = () => Math.round(Date.now() / 1000);
export const WORKCHAIN = 0; // normally 0, only special contracts should be deployed to masterchain (-1)
export const FRACTION_DIGITS = 2;
export const DEFAULT_DECIMAL_PLACES = 8;
export const TON_DECIMAL_PLACES = 9;
export const MASKITO_THOUSAND_SEPARATOR = ',';
export const amountMask = (decimals: number) =>
  maskitoNumberOptionsGenerator({
    decimalZeroPadding: false,
    precision: decimals ?? DEFAULT_DECIMAL_PLACES,
    decimalSeparator: '.',
    min: 0,
    // postfix: '',
  });
export const START_TIME_FORMAT = 'DD MMM YYYY';

// Spintria
export const MAINNET_SPINTRIA_MASTER_ADDRESS = 'EQACLXDwit01stiqK9FvYiJo15luVzfD5zU8uwDSq6JXxbP8';

// TestSpintria
// export const MAINNET_SPINTRIA_MASTER_ADDRESS = 'EQB6_NOx7-3RqpsWE9XBUjsgbvoXx95_Qg1FHvdCbkVCl29v';

export const TESTNET_SPINTRIA_MASTER_ADDRESS = 'kQD_ISeGqNaExqC21k7sy6y0DQjE_JsMDe8MPmZiuGtYOZDd';
