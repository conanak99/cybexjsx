"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serializer_1 = __importDefault(require("./serializer"));
const types_1 = __importDefault(require("./types"));
let { 
// id_type,
// varint32,
uint8, uint16, uint32, int64, uint64, string, bytes, bool, array, fixed_array, protocol_id_type, object_id_type, vote_id, 
// future_extensions,
static_variant, map, set, public_key, address, time_point_sec, optional } = types_1.default;
// future_extensions = types.void;
/*
When updating generated code
Replace:  operation = static_variant [
with:     operation.st_operations = [

Delete:
public_key = new Serializer(
    "public_key"
    key_data: bytes 33
)

*/
// Place-holder, their are dependencies on "operation" .. The final list of
// operations is not avialble until the very end of the generated code.
// See: operation.st_operations = ...
const operation = static_variant();
exports.operation = operation;
// For module.exports
// var Serializer = function(operation_name, serilization_types_object) {
//   return new SerializerImpl(operation_name, serilization_types_object);
//   // return module.exports[operation_name] = s;
// };
exports.void_ext = new serializer_1.default("void_ext");
const cybex_ext_vesting = new serializer_1.default("cybex_ext_vesting", {
    vesting_period: uint64,
    public_key
});
const cybex_ext_transfer_vesting = new serializer_1.default("cybex_ext_transfer_vesting", {
    vesting_cliff: uint64,
    vesting_duration: uint64
});
const cybex_ext_swap = new serializer_1.default("cybex_ext_swap", {
    cybex_ext_swap: string
});
const cybex_ext_xfer_to_name = new serializer_1.default("cybex_ext_xfer_to_name", {
    name: string,
    asset_sym: string,
    fee_asset_sym: string,
    hw_cookie: uint8
});
const cybex_xfer_item = new serializer_1.default("cybex_xfer_item", {
    name: string,
    amount: string
});
const cybex_ext_xfer_to_many = new serializer_1.default("cybex_ext_xfer_to_many", {
    list: array(cybex_xfer_item)
});
const future_extensions = static_variant([
    exports.void_ext,
    cybex_ext_vesting,
    cybex_ext_swap,
    cybex_ext_transfer_vesting,
    cybex_ext_xfer_to_name,
    cybex_ext_xfer_to_many
]);
// Custom-types follow Generated code:
// ##  Generated code follows
// # programs/js_operation_serializer > npm i -g decaffeinate
// ## -------------------------------
exports.transfer_operation_fee_parameters = new serializer_1.default("transfer_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.limit_order_create_operation_fee_parameters = new serializer_1.default("limit_order_create_operation_fee_parameters", {
    fee: uint64
});
exports.limit_order_cancel_operation_fee_parameters = new serializer_1.default("limit_order_cancel_operation_fee_parameters", {
    fee: uint64
});
exports.call_order_update_operation_fee_parameters = new serializer_1.default("call_order_update_operation_fee_parameters", {
    fee: uint64
});
exports.fill_order_operation_fee_parameters = new serializer_1.default("fill_order_operation_fee_parameters", {
    fee: uint64
});
exports.account_create_operation_fee_parameters = new serializer_1.default("account_create_operation_fee_parameters", {
    basic_fee: uint64,
    premium_fee: uint64,
    price_per_kbyte: uint32
});
exports.account_update_operation_fee_parameters = new serializer_1.default("account_update_operation_fee_parameters", {
    fee: int64,
    price_per_kbyte: uint32
});
exports.account_whitelist_operation_fee_parameters = new serializer_1.default("account_whitelist_operation_fee_parameters", {
    fee: int64
});
exports.account_upgrade_operation_fee_parameters = new serializer_1.default("account_upgrade_operation_fee_parameters", {
    membership_annual_fee: uint64,
    membership_lifetime_fee: uint64
});
exports.account_transfer_operation_fee_parameters = new serializer_1.default("account_transfer_operation_fee_parameters", {
    fee: uint64
});
exports.asset_create_operation_fee_parameters = new serializer_1.default("asset_create_operation_fee_parameters", {
    symbol3: uint64,
    symbol4: uint64,
    long_symbol: uint64,
    price_per_kbyte: uint32
});
exports.asset_update_operation_fee_parameters = new serializer_1.default("asset_update_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.asset_update_bitasset_operation_fee_parameters = new serializer_1.default("asset_update_bitasset_operation_fee_parameters", {
    fee: uint64
});
exports.asset_update_feed_producers_operation_fee_parameters = new serializer_1.default("asset_update_feed_producers_operation_fee_parameters", {
    fee: uint64
});
exports.asset_issue_operation_fee_parameters = new serializer_1.default("asset_issue_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.initiate_crowdfund_operation_fee_parameters = new serializer_1.default("initiate_crowdfund_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.participate_crowdfund_operation_fee_parameters = new serializer_1.default("participate_crowdfund_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.withdraw_crowdfund_operation_fee_parameters = new serializer_1.default("withdraw_crowdfund_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.asset_reserve_operation_fee_parameters = new serializer_1.default("asset_reserve_operation_fee_parameters", {
    fee: uint64
});
exports.asset_fund_fee_pool_operation_fee_parameters = new serializer_1.default("asset_fund_fee_pool_operation_fee_parameters", {
    fee: uint64
});
exports.asset_settle_operation_fee_parameters = new serializer_1.default("asset_settle_operation_fee_parameters", {
    fee: uint64
});
exports.asset_global_settle_operation_fee_parameters = new serializer_1.default("asset_global_settle_operation_fee_parameters", {
    fee: uint64
});
exports.asset_publish_feed_operation_fee_parameters = new serializer_1.default("asset_publish_feed_operation_fee_parameters", {
    fee: uint64
});
exports.witness_create_operation_fee_parameters = new serializer_1.default("witness_create_operation_fee_parameters", {
    fee: uint64
});
exports.witness_update_operation_fee_parameters = new serializer_1.default("witness_update_operation_fee_parameters", {
    fee: int64
});
exports.proposal_create_operation_fee_parameters = new serializer_1.default("proposal_create_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.proposal_update_operation_fee_parameters = new serializer_1.default("proposal_update_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.proposal_delete_operation_fee_parameters = new serializer_1.default("proposal_delete_operation_fee_parameters", {
    fee: uint64
});
exports.withdraw_permission_create_operation_fee_parameters = new serializer_1.default("withdraw_permission_create_operation_fee_parameters", {
    fee: uint64
});
exports.withdraw_permission_update_operation_fee_parameters = new serializer_1.default("withdraw_permission_update_operation_fee_parameters", {
    fee: uint64
});
exports.withdraw_permission_claim_operation_fee_parameters = new serializer_1.default("withdraw_permission_claim_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.withdraw_permission_delete_operation_fee_parameters = new serializer_1.default("withdraw_permission_delete_operation_fee_parameters", {
    fee: uint64
});
exports.committee_member_create_operation_fee_parameters = new serializer_1.default("committee_member_create_operation_fee_parameters", {
    fee: uint64
});
exports.committee_member_update_operation_fee_parameters = new serializer_1.default("committee_member_update_operation_fee_parameters", {
    fee: uint64
});
exports.committee_member_update_global_parameters_operation_fee_parameters = new serializer_1.default("committee_member_update_global_parameters_operation_fee_parameters", {
    fee: uint64
});
exports.vesting_balance_create_operation_fee_parameters = new serializer_1.default("vesting_balance_create_operation_fee_parameters", {
    fee: uint64
});
exports.vesting_balance_withdraw_operation_fee_parameters = new serializer_1.default("vesting_balance_withdraw_operation_fee_parameters", {
    fee: uint64
});
exports.worker_create_operation_fee_parameters = new serializer_1.default("worker_create_operation_fee_parameters", {
    fee: uint64
});
exports.custom_operation_fee_parameters = new serializer_1.default("custom_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.assert_operation_fee_parameters = new serializer_1.default("assert_operation_fee_parameters", {
    fee: uint64
});
exports.balance_claim_operation_fee_parameters = new serializer_1.default("balance_claim_operation_fee_parameters");
exports.override_transfer_operation_fee_parameters = new serializer_1.default("override_transfer_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32
});
exports.transfer_to_blind_operation_fee_parameters = new serializer_1.default("transfer_to_blind_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32
});
exports.blind_transfer_operation_fee_parameters = new serializer_1.default("blind_transfer_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32
});
exports.transfer_from_blind_operation_fee_parameters = new serializer_1.default("transfer_from_blind_operation_fee_parameters", {
    fee: uint64
});
exports.asset_settle_cancel_operation_fee_parameters = new serializer_1.default("asset_settle_cancel_operation_fee_parameters");
exports.asset_claim_fees_operation_fee_parameters = new serializer_1.default("asset_claim_fees_operation_fee_parameters", {
    fee: uint64
});
const fee_parameters = static_variant([
    exports.transfer_operation_fee_parameters,
    exports.limit_order_create_operation_fee_parameters,
    exports.limit_order_cancel_operation_fee_parameters,
    exports.call_order_update_operation_fee_parameters,
    exports.fill_order_operation_fee_parameters,
    exports.account_create_operation_fee_parameters,
    exports.account_update_operation_fee_parameters,
    exports.account_whitelist_operation_fee_parameters,
    exports.account_upgrade_operation_fee_parameters,
    exports.account_transfer_operation_fee_parameters,
    exports.asset_create_operation_fee_parameters,
    exports.asset_update_operation_fee_parameters,
    exports.asset_update_bitasset_operation_fee_parameters,
    exports.asset_update_feed_producers_operation_fee_parameters,
    exports.asset_issue_operation_fee_parameters,
    exports.asset_reserve_operation_fee_parameters,
    exports.asset_fund_fee_pool_operation_fee_parameters,
    exports.asset_settle_operation_fee_parameters,
    exports.asset_global_settle_operation_fee_parameters,
    exports.asset_publish_feed_operation_fee_parameters,
    exports.witness_create_operation_fee_parameters,
    exports.witness_update_operation_fee_parameters,
    exports.proposal_create_operation_fee_parameters,
    exports.proposal_update_operation_fee_parameters,
    exports.proposal_delete_operation_fee_parameters,
    exports.withdraw_permission_create_operation_fee_parameters,
    exports.withdraw_permission_update_operation_fee_parameters,
    exports.withdraw_permission_claim_operation_fee_parameters,
    exports.withdraw_permission_delete_operation_fee_parameters,
    exports.committee_member_create_operation_fee_parameters,
    exports.committee_member_update_operation_fee_parameters,
    exports.committee_member_update_global_parameters_operation_fee_parameters,
    exports.vesting_balance_create_operation_fee_parameters,
    exports.vesting_balance_withdraw_operation_fee_parameters,
    exports.worker_create_operation_fee_parameters,
    exports.custom_operation_fee_parameters,
    exports.assert_operation_fee_parameters,
    exports.balance_claim_operation_fee_parameters,
    exports.override_transfer_operation_fee_parameters,
    exports.transfer_to_blind_operation_fee_parameters,
    exports.blind_transfer_operation_fee_parameters,
    exports.transfer_from_blind_operation_fee_parameters,
    exports.asset_settle_cancel_operation_fee_parameters,
    exports.asset_claim_fees_operation_fee_parameters,
    exports.asset_settle_cancel_operation_fee_parameters,
    exports.initiate_crowdfund_operation_fee_parameters,
    exports.participate_crowdfund_operation_fee_parameters,
    exports.withdraw_crowdfund_operation_fee_parameters
]);
exports.fee_schedule = new serializer_1.default("fee_schedule", {
    parameters: set(fee_parameters),
    scale: uint32
});
exports.void_result = new serializer_1.default("void_result");
exports.asset = new serializer_1.default("asset", {
    amount: int64,
    asset_id: protocol_id_type("asset")
});
const operation_result = static_variant([exports.void_result, object_id_type, exports.asset]);
exports.processed_transaction = new serializer_1.default("processed_transaction", {
    ref_block_num: uint16,
    ref_block_prefix: uint32,
    expiration: time_point_sec,
    operations: array(operation),
    extensions: set(future_extensions),
    signatures: array(bytes(65)),
    operation_results: array(operation_result)
});
exports.signed_block = new serializer_1.default("signed_block", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: protocol_id_type("witness"),
    transaction_merkle_root: bytes(20),
    extensions: set(future_extensions),
    witness_signature: bytes(65),
    transactions: array(exports.processed_transaction)
});
exports.block_header = new serializer_1.default("block_header", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: protocol_id_type("witness"),
    transaction_merkle_root: bytes(20),
    extensions: set(future_extensions)
});
exports.signed_block_header = new serializer_1.default("signed_block_header", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: protocol_id_type("witness"),
    transaction_merkle_root: bytes(20),
    extensions: set(future_extensions),
    witness_signature: bytes(65)
});
exports.memo_data = new serializer_1.default("memo_data", {
    from: public_key,
    to: public_key,
    nonce: uint64,
    message: bytes()
});
exports.transfer = new serializer_1.default("transfer", {
    fee: exports.asset,
    from: protocol_id_type("account"),
    to: protocol_id_type("account"),
    amount: exports.asset,
    memo: optional(exports.memo_data),
    extensions: set(future_extensions)
});
exports.limit_order_create = new serializer_1.default("limit_order_create", {
    fee: exports.asset,
    seller: protocol_id_type("account"),
    amount_to_sell: exports.asset,
    min_to_receive: exports.asset,
    expiration: time_point_sec,
    fill_or_kill: bool,
    extensions: set(future_extensions)
});
exports.limit_order_cancel = new serializer_1.default("limit_order_cancel", {
    fee: exports.asset,
    fee_paying_account: protocol_id_type("account"),
    order: protocol_id_type("limit_order"),
    extensions: set(future_extensions)
});
exports.call_order_update = new serializer_1.default("call_order_update", {
    fee: exports.asset,
    funding_account: protocol_id_type("account"),
    delta_collateral: exports.asset,
    delta_debt: exports.asset,
    extensions: set(future_extensions)
});
exports.fill_order = new serializer_1.default("fill_order", {
    fee: exports.asset,
    order_id: object_id_type,
    account_id: protocol_id_type("account"),
    pays: exports.asset,
    receives: exports.asset
});
exports.authority = new serializer_1.default("authority", {
    weight_threshold: uint32,
    account_auths: map(protocol_id_type("account"), uint16),
    key_auths: map(public_key, uint16),
    address_auths: map(address, uint16)
});
exports.account_options = new serializer_1.default("account_options", {
    memo_key: public_key,
    voting_account: protocol_id_type("account"),
    num_witness: uint16,
    num_committee: uint16,
    votes: set(vote_id),
    extensions: set(future_extensions)
});
exports.account_create = new serializer_1.default("account_create", {
    fee: exports.asset,
    registrar: protocol_id_type("account"),
    referrer: protocol_id_type("account"),
    referrer_percent: uint16,
    name: string,
    owner: exports.authority,
    active: exports.authority,
    options: exports.account_options,
    extensions: set(future_extensions)
});
exports.account_update = new serializer_1.default("account_update", {
    fee: exports.asset,
    account: protocol_id_type("account"),
    owner: optional(exports.authority),
    active: optional(exports.authority),
    new_options: optional(exports.account_options),
    extensions: set(future_extensions)
});
exports.account_whitelist = new serializer_1.default("account_whitelist", {
    fee: exports.asset,
    authorizing_account: protocol_id_type("account"),
    account_to_list: protocol_id_type("account"),
    new_listing: uint8,
    extensions: set(future_extensions)
});
exports.account_upgrade = new serializer_1.default("account_upgrade", {
    fee: exports.asset,
    account_to_upgrade: protocol_id_type("account"),
    upgrade_to_lifetime_member: bool,
    extensions: set(future_extensions)
});
exports.account_transfer = new serializer_1.default("account_transfer", {
    fee: exports.asset,
    account_id: protocol_id_type("account"),
    new_owner: protocol_id_type("account"),
    extensions: set(future_extensions)
});
exports.price = new serializer_1.default("price", {
    base: exports.asset,
    quote: exports.asset
});
exports.asset_options = new serializer_1.default("asset_options", {
    max_supply: int64,
    market_fee_percent: uint16,
    max_market_fee: int64,
    issuer_permissions: uint16,
    flags: uint16,
    core_exchange_rate: exports.price,
    whitelist_authorities: set(protocol_id_type("account")),
    blacklist_authorities: set(protocol_id_type("account")),
    whitelist_markets: set(protocol_id_type("asset")),
    blacklist_markets: set(protocol_id_type("asset")),
    description: string,
    extensions: set(future_extensions)
});
exports.bitasset_options = new serializer_1.default("bitasset_options", {
    feed_lifetime_sec: uint32,
    minimum_feeds: uint8,
    force_settlement_delay_sec: uint32,
    force_settlement_offset_percent: uint16,
    maximum_force_settlement_volume: uint16,
    short_backing_asset: protocol_id_type("asset"),
    extensions: set(future_extensions)
});
exports.asset_create = new serializer_1.default("asset_create", {
    fee: exports.asset,
    issuer: protocol_id_type("account"),
    symbol: string,
    precision: uint8,
    common_options: exports.asset_options,
    bitasset_opts: optional(exports.bitasset_options),
    is_prediction_market: bool,
    extensions: set(future_extensions)
});
exports.asset_update = new serializer_1.default("asset_update", {
    fee: exports.asset,
    issuer: protocol_id_type("account"),
    asset_to_update: protocol_id_type("asset"),
    new_issuer: optional(protocol_id_type("account")),
    new_options: exports.asset_options,
    extensions: set(future_extensions)
});
exports.asset_update_bitasset = new serializer_1.default("asset_update_bitasset", {
    fee: exports.asset,
    issuer: protocol_id_type("account"),
    asset_to_update: protocol_id_type("asset"),
    new_options: exports.bitasset_options,
    extensions: set(future_extensions)
});
exports.asset_update_feed_producers = new serializer_1.default("asset_update_feed_producers", {
    fee: exports.asset,
    issuer: protocol_id_type("account"),
    asset_to_update: protocol_id_type("asset"),
    new_feed_producers: set(protocol_id_type("account")),
    extensions: set(future_extensions)
});
exports.asset_issue = new serializer_1.default("asset_issue", {
    fee: exports.asset,
    issuer: protocol_id_type("account"),
    asset_to_issue: exports.asset,
    issue_to_account: protocol_id_type("account"),
    memo: optional(exports.memo_data),
    extensions: set(future_extensions)
});
exports.asset_reserve = new serializer_1.default("asset_reserve", {
    fee: exports.asset,
    payer: protocol_id_type("account"),
    amount_to_reserve: exports.asset,
    extensions: set(future_extensions)
});
exports.asset_fund_fee_pool = new serializer_1.default("asset_fund_fee_pool", {
    fee: exports.asset,
    from_account: protocol_id_type("account"),
    asset_id: protocol_id_type("asset"),
    amount: int64,
    extensions: set(future_extensions)
});
exports.asset_settle = new serializer_1.default("asset_settle", {
    fee: exports.asset,
    account: protocol_id_type("account"),
    amount: exports.asset,
    extensions: set(future_extensions)
});
exports.asset_global_settle = new serializer_1.default("asset_global_settle", {
    fee: exports.asset,
    issuer: protocol_id_type("account"),
    asset_to_settle: protocol_id_type("asset"),
    settle_price: exports.price,
    extensions: set(future_extensions)
});
exports.participate_crowdfund = new serializer_1.default("participate_crowdfund", {
    fee: exports.asset,
    buyer: protocol_id_type("account"),
    valuation: int64,
    cap: int64,
    // pubkey: address,
    crowdfund: protocol_id_type("crowdfund")
    // extensions: set(future_extensions)
});
exports.withdraw_crowdfund = new serializer_1.default("withdraw_crowdfund", {
    fee: exports.asset,
    buyer: protocol_id_type("account"),
    crowdfund_contract: protocol_id_type("crowdfund_contract")
});
exports.initiate_crowdfund = new serializer_1.default("initiate_crowdfund", {
    fee: exports.asset,
    owner: protocol_id_type("account"),
    asset_id: protocol_id_type("asset"),
    t: uint64,
    u: uint64
    // v: uint64,
    // extensions: set(future_extensions)
});
exports.price_feed = new serializer_1.default("price_feed", {
    settlement_price: exports.price,
    maintenance_collateral_ratio: uint16,
    maximum_short_squeeze_ratio: uint16,
    core_exchange_rate: exports.price
});
exports.asset_publish_feed = new serializer_1.default("asset_publish_feed", {
    fee: exports.asset,
    publisher: protocol_id_type("account"),
    asset_id: protocol_id_type("asset"),
    feed: exports.price_feed,
    extensions: set(future_extensions)
});
exports.witness_create = new serializer_1.default("witness_create", {
    fee: exports.asset,
    witness_account: protocol_id_type("account"),
    url: string,
    block_signing_key: public_key
});
exports.witness_update = new serializer_1.default("witness_update", {
    fee: exports.asset,
    witness: protocol_id_type("witness"),
    witness_account: protocol_id_type("account"),
    new_url: optional(string),
    new_signing_key: optional(public_key)
});
exports.op_wrapper = new serializer_1.default("op_wrapper", {
    op: operation
});
exports.proposal_create = new serializer_1.default("proposal_create", {
    fee: exports.asset,
    fee_paying_account: protocol_id_type("account"),
    expiration_time: time_point_sec,
    proposed_ops: array(exports.op_wrapper),
    review_period_seconds: optional(uint32),
    extensions: set(future_extensions)
});
exports.proposal_update = new serializer_1.default("proposal_update", {
    fee: exports.asset,
    fee_paying_account: protocol_id_type("account"),
    proposal: protocol_id_type("proposal"),
    active_approvals_to_add: set(protocol_id_type("account")),
    active_approvals_to_remove: set(protocol_id_type("account")),
    owner_approvals_to_add: set(protocol_id_type("account")),
    owner_approvals_to_remove: set(protocol_id_type("account")),
    key_approvals_to_add: set(public_key),
    key_approvals_to_remove: set(public_key),
    extensions: set(future_extensions)
});
exports.proposal_delete = new serializer_1.default("proposal_delete", {
    fee: exports.asset,
    fee_paying_account: protocol_id_type("account"),
    using_owner_authority: bool,
    proposal: protocol_id_type("proposal"),
    extensions: set(future_extensions)
});
exports.withdraw_permission_create = new serializer_1.default("withdraw_permission_create", {
    fee: exports.asset,
    withdraw_from_account: protocol_id_type("account"),
    authorized_account: protocol_id_type("account"),
    withdrawal_limit: exports.asset,
    withdrawal_period_sec: uint32,
    periods_until_expiration: uint32,
    period_start_time: time_point_sec
});
exports.withdraw_permission_update = new serializer_1.default("withdraw_permission_update", {
    fee: exports.asset,
    withdraw_from_account: protocol_id_type("account"),
    authorized_account: protocol_id_type("account"),
    permission_to_update: protocol_id_type("withdraw_permission"),
    withdrawal_limit: exports.asset,
    withdrawal_period_sec: uint32,
    period_start_time: time_point_sec,
    periods_until_expiration: uint32
});
exports.withdraw_permission_claim = new serializer_1.default("withdraw_permission_claim", {
    fee: exports.asset,
    withdraw_permission: protocol_id_type("withdraw_permission"),
    withdraw_from_account: protocol_id_type("account"),
    withdraw_to_account: protocol_id_type("account"),
    amount_to_withdraw: exports.asset,
    memo: optional(exports.memo_data)
});
exports.withdraw_permission_delete = new serializer_1.default("withdraw_permission_delete", {
    fee: exports.asset,
    withdraw_from_account: protocol_id_type("account"),
    authorized_account: protocol_id_type("account"),
    withdrawal_permission: protocol_id_type("withdraw_permission")
});
exports.committee_member_create = new serializer_1.default("committee_member_create", {
    fee: exports.asset,
    committee_member_account: protocol_id_type("account"),
    url: string
});
exports.committee_member_update = new serializer_1.default("committee_member_update", {
    fee: exports.asset,
    committee_member: protocol_id_type("committee_member"),
    committee_member_account: protocol_id_type("account"),
    new_url: optional(string)
});
exports.chain_parameters = new serializer_1.default("chain_parameters", {
    current_fees: exports.fee_schedule,
    block_interval: uint8,
    maintenance_interval: uint32,
    maintenance_skip_slots: uint8,
    committee_proposal_review_period: uint32,
    maximum_transaction_size: uint32,
    maximum_block_size: uint32,
    maximum_time_until_expiration: uint32,
    maximum_proposal_lifetime: uint32,
    maximum_asset_whitelist_authorities: uint8,
    maximum_asset_feed_publishers: uint8,
    maximum_witness_count: uint16,
    maximum_committee_count: uint16,
    maximum_authority_membership: uint16,
    reserve_percent_of_fee: uint16,
    network_percent_of_fee: uint16,
    lifetime_referrer_percent_of_fee: uint16,
    cashback_vesting_period_seconds: uint32,
    cashback_vesting_threshold: int64,
    count_non_member_votes: bool,
    allow_non_member_whitelists: bool,
    witness_pay_per_block: int64,
    worker_budget_per_day: int64,
    max_predicate_opcode: uint16,
    fee_liquidation_threshold: int64,
    accounts_per_fee_scale: uint16,
    account_fee_scale_bitshifts: uint8,
    max_authority_depth: uint8,
    extensions: set(future_extensions)
});
exports.committee_member_update_global_parameters = new serializer_1.default("committee_member_update_global_parameters", {
    fee: exports.asset,
    new_parameters: exports.chain_parameters
});
exports.linear_vesting_policy_initializer = new serializer_1.default("linear_vesting_policy_initializer", {
    begin_timestamp: time_point_sec,
    vesting_cliff_seconds: uint32,
    vesting_duration_seconds: uint32
});
exports.cdd_vesting_policy_initializer = new serializer_1.default("cdd_vesting_policy_initializer", {
    start_claim: time_point_sec,
    vesting_seconds: uint32
});
const vesting_policy_initializer = static_variant([
    exports.linear_vesting_policy_initializer,
    exports.cdd_vesting_policy_initializer
]);
exports.vesting_balance_create = new serializer_1.default("vesting_balance_create", {
    fee: exports.asset,
    creator: protocol_id_type("account"),
    owner: protocol_id_type("account"),
    amount: exports.asset,
    policy: vesting_policy_initializer
});
exports.vesting_balance_withdraw = new serializer_1.default("vesting_balance_withdraw", {
    fee: exports.asset,
    vesting_balance: protocol_id_type("vesting_balance"),
    owner: protocol_id_type("account"),
    amount: exports.asset
});
exports.refund_worker_initializer = new serializer_1.default("refund_worker_initializer");
exports.vesting_balance_worker_initializer = new serializer_1.default("vesting_balance_worker_initializer", {
    pay_vesting_period_days: uint16
});
exports.burn_worker_initializer = new serializer_1.default("burn_worker_initializer");
const worker_initializer = static_variant([
    exports.refund_worker_initializer,
    exports.vesting_balance_worker_initializer,
    exports.burn_worker_initializer
]);
exports.worker_create = new serializer_1.default("worker_create", {
    fee: exports.asset,
    owner: protocol_id_type("account"),
    work_begin_date: time_point_sec,
    work_end_date: time_point_sec,
    daily_pay: int64,
    name: string,
    url: string,
    initializer: worker_initializer
});
exports.custom = new serializer_1.default("custom", {
    fee: exports.asset,
    payer: protocol_id_type("account"),
    required_auths: set(protocol_id_type("account")),
    id: uint16,
    data: bytes()
});
exports.account_name_eq_lit_predicate = new serializer_1.default("account_name_eq_lit_predicate", {
    account_id: protocol_id_type("account"),
    name: string
});
exports.asset_symbol_eq_lit_predicate = new serializer_1.default("asset_symbol_eq_lit_predicate", {
    asset_id: protocol_id_type("asset"),
    symbol: string
});
exports.block_id_predicate = new serializer_1.default("block_id_predicate", {
    id: bytes(20)
});
const predicate = static_variant([
    exports.account_name_eq_lit_predicate,
    exports.asset_symbol_eq_lit_predicate,
    exports.block_id_predicate
]);
exports.assert = new serializer_1.default("assert", {
    fee: exports.asset,
    fee_paying_account: protocol_id_type("account"),
    predicates: array(predicate),
    required_auths: set(protocol_id_type("account")),
    extensions: set(future_extensions)
});
exports.balance_claim = new serializer_1.default("balance_claim", {
    fee: exports.asset,
    deposit_to_account: protocol_id_type("account"),
    balance_to_claim: protocol_id_type("balance"),
    balance_owner_key: public_key,
    total_claimed: exports.asset
});
exports.override_transfer = new serializer_1.default("override_transfer", {
    fee: exports.asset,
    issuer: protocol_id_type("account"),
    from: protocol_id_type("account"),
    to: protocol_id_type("account"),
    amount: exports.asset,
    memo: optional(exports.memo_data),
    extensions: set(future_extensions)
});
exports.stealth_confirmation = new serializer_1.default("stealth_confirmation", {
    one_time_key: public_key,
    to: optional(public_key),
    encrypted_memo: bytes()
});
exports.blind_output = new serializer_1.default("blind_output", {
    commitment: bytes(33),
    range_proof: bytes(),
    owner: exports.authority,
    stealth_memo: optional(exports.stealth_confirmation)
});
exports.transfer_to_blind = new serializer_1.default("transfer_to_blind", {
    fee: exports.asset,
    amount: exports.asset,
    from: protocol_id_type("account"),
    blinding_factor: bytes(32),
    outputs: array(exports.blind_output)
});
exports.blind_input = new serializer_1.default("blind_input", {
    commitment: bytes(33),
    owner: exports.authority
});
exports.blind_transfer = new serializer_1.default("blind_transfer", {
    fee: exports.asset,
    inputs: array(exports.blind_input),
    outputs: array(exports.blind_output)
});
exports.transfer_from_blind = new serializer_1.default("transfer_from_blind", {
    fee: exports.asset,
    amount: exports.asset,
    to: protocol_id_type("account"),
    blinding_factor: bytes(32),
    inputs: array(exports.blind_input)
});
exports.asset_settle_cancel = new serializer_1.default("asset_settle_cancel", {
    fee: exports.asset,
    settlement: protocol_id_type("force_settlement"),
    account: protocol_id_type("account"),
    amount: exports.asset,
    extensions: set(future_extensions)
});
exports.asset_claim_fees = new serializer_1.default("asset_claim_fees", {
    fee: exports.asset,
    issuer: protocol_id_type("account"),
    amount_to_claim: exports.asset,
    extensions: set(future_extensions)
});
operation.st_operations = [
    exports.transfer,
    exports.limit_order_create,
    exports.limit_order_cancel,
    exports.call_order_update,
    exports.fill_order,
    exports.account_create,
    exports.account_update,
    exports.account_whitelist,
    exports.account_upgrade,
    exports.account_transfer,
    exports.asset_create,
    exports.asset_update,
    exports.asset_update_bitasset,
    exports.asset_update_feed_producers,
    exports.asset_issue,
    exports.asset_reserve,
    exports.asset_fund_fee_pool,
    exports.asset_settle,
    exports.asset_global_settle,
    exports.asset_publish_feed,
    exports.witness_create,
    exports.witness_update,
    exports.proposal_create,
    exports.proposal_update,
    exports.proposal_delete,
    exports.withdraw_permission_create,
    exports.withdraw_permission_update,
    exports.withdraw_permission_claim,
    exports.withdraw_permission_delete,
    exports.committee_member_create,
    exports.committee_member_update,
    exports.committee_member_update_global_parameters,
    exports.vesting_balance_create,
    exports.vesting_balance_withdraw,
    exports.worker_create,
    exports.custom,
    exports.assert,
    exports.balance_claim,
    exports.override_transfer,
    exports.transfer_to_blind,
    exports.blind_transfer,
    exports.transfer_from_blind,
    exports.asset_settle_cancel,
    exports.asset_claim_fees,
    exports.asset_settle_cancel,
    exports.initiate_crowdfund,
    exports.participate_crowdfund,
    exports.withdraw_crowdfund
];
exports.transaction = new serializer_1.default("transaction", {
    ref_block_num: uint16,
    ref_block_prefix: uint32,
    expiration: time_point_sec,
    operations: array(operation),
    extensions: set(future_extensions)
});
exports.signed_transaction = new serializer_1.default("signed_transaction", {
    ref_block_num: uint16,
    ref_block_prefix: uint32,
    expiration: time_point_sec,
    operations: array(operation),
    extensions: set(future_extensions),
    signatures: array(bytes(65))
});
// # -------------------------------
// #  Generated code end
// # -------------------------------
// Custom Types
exports.stealth_memo_data = new serializer_1.default("stealth_memo_data", {
    from: optional(public_key),
    amount: exports.asset,
    blinding_factor: bytes(32),
    commitment: bytes(33),
    check: uint32
});
exports.fund_query = new serializer_1.default("fund_query", {
    accountName: string,
    asset: optional(string),
    fundType: optional(string),
    size: optional(uint32),
    offset: optional(uint32),
    expiration: time_point_sec
});
exports.set_refer = new serializer_1.default("set_refer", {
    account: string,
    action: string,
    referrer: string,
    expiration: int64
});
exports.query_address = new serializer_1.default("query_address", {
    loginName: string,
    expiration: int64
});
exports.set_address = new serializer_1.default("set_address", {
    loginName: string,
    receiverName: string,
    email: string,
    qqNo: string,
    wechatNo: string,
    proviceId: int64,
    homeAddress: string,
    expiration: int64
});
