export abstract class Op {
  static transfer = 0xf8a7ea5;
  static transfer_notification = 0x7362d09c;
  static internal_transfer = 0x178d4519;
  static excesses = 0xd53276db;
  static burn = 0x595f07bc;
  static burn_notification = 0x7bdd97de;

  // vesting
  static refund = 0x5b2c1458;
  static clawback = 0xb380a0ab;

  static provide_wallet_address = 0x2c76b973;
  static take_wallet_address = 0xd1735400;
  static mint = 0x642b7d07;
  static change_admin = 0x6501f354;
  static claim_admin = 0xfb88e119;
  static upgrade = 0x2508d66a;
  static call_to = 0x235caf52;
  static top_up = 0xd372158c;
  static change_metadata_url = 0xcb862902;
  static set_status = 0xeed236d3;

  static provide_reward_pool = 0x6ee35fcb;
  static provide_stake = 0x6d56d9ea;
}

export abstract class Errors {
  static invalid_op = 72;
  static wrong_op = 0xffff;
  static not_owner = 73;
  static not_valid_wallet = 74;
  static wrong_workchain = 333;

  static contract_locked = 45;
  static balance_error = 47;
  static not_enough_gas = 48;
  static invalid_mesage = 49;
  static discovery_fee_not_matched = 75;

  static deposit_error = 147;
  static not_initialized = 105;
  static supply_error = 247;
}
