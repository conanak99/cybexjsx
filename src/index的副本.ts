/* Serializer */
import Serializer from "./serializer/src/serializer";
import fp from "./serializer/src/FastParser";
import types from "./serializer/src/types";
import * as ops from "./serializer/src/operations";
import template from "./serializer/src/template";
import SerializerValidation from "./serializer/src/SerializerValidation";

export { Serializer, fp, types, ops, template, SerializerValidation };

/* ECC */
import Address from "./ecc/src/address";
import Aes from "./ecc/src/aes";
import PrivateKey from "./ecc/src/PrivateKey";
import PublicKey from "./ecc/src/PublicKey";
import Signature from "./ecc/src/signature";
import brainKey from "./ecc/src/BrainKey";
import * as hash from "./ecc/src/hash";
import key from "./ecc/src/KeyUtils";

export { Address, Aes, PrivateKey, PublicKey, Signature, brainKey, hash, key };

// /* Chain */
// import ChainStore from "./chain/src/ChainStore";
// import TransactionBuilder  from "./chain/src/TransactionBuilder";
// import ChainTypes from "./chain/src/ChainTypes";
// import ObjectId from "./chain/src/ObjectId";
// import NumberUtils from "./chain/src/NumberUtils";
// import TransactionHelper from "./chain/src/TransactionHelper";
// import ChainValidation from "./chain/src/ChainValidation";
// import EmitterInstance from "./chain/src/EmitterInstance";
// import Login from "./chain/src/AccountLogin";

// const {FetchChainObjects, FetchChain} = ChainStore;

// export {ChainStore, TransactionBuilder, FetchChainObjects, ChainTypes, EmitterInstance,
//     ObjectId, NumberUtils, TransactionHelper, ChainValidation, FetchChain, Login }
export namespace Cybex {
  export interface Asset {
    id: string;
    symbol: string;
    precision: number;
    issuer: string;
    options: {
      max_supply: string;
      market_fee_percent: number;
      max_market_fee: string;
      issuer_permissions: number;
      flags: number;
      core_exchange_rate: any[];
      whitelist_authorities: any[];
      blacklist_authorities: any[];
      whitelist_markets: any[];
      blacklist_markets: any[];
      description: string;
      extensions: any[];
    };
    dynamic_asset_data_id: string;
  }

  export interface AccountBalance {
    amount: number;
    asset_id: string;
  }

  export interface Account {
    id: string;
    membership_expiration_date: string;
    registrar: string;
    referrer: string;
    lifetime_referrer: string;
    network_fee_percentage: number;
    lifetime_referrer_fee_percentage: number;
    referrer_rewards_percentage: number;
    name: string;
    owner: AccountAuthority;
    active: AccountAuthority;
    options: Options;
    statistics: string;
    whitelisting_accounts: string[];
    blacklisting_accounts: any[];
    whitelisted_accounts: string[];
    blacklisted_accounts: any[];
    cashback_vb: string;
    owner_special_authority: Array<ActiveSpecialAuthorityClass | number>;
    active_special_authority: Array<ActiveSpecialAuthorityClass | number>;
    top_n_control_flags: number;
  }

  export type AuthorityWithWeight = [string, number];

  export interface AccountAuthority {
    weight_threshold: number;
    account_auths: any[];
    key_auths: Array<AuthorityWithWeight>;
    address_auths: any[];
  }

  export interface ActiveSpecialAuthorityClass {}

  export interface Options {
    memo_key: string;
    voting_account: string;
    num_witness: number;
    num_committee: number;
    votes: any[];
    extensions: any[];
  }
}