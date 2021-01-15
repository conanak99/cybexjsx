"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const ecc_1 = require("../ecc");
const serializer_1 = require("../serializer");
const Operation_1 = require("./Operation");
var head_block_time_string, committee_min_review;
class DefaultTrParams {
    constructor() {
        this.ref_block_num = 0;
        this.ref_block_prefix = 0;
        this.expiration = 0;
        this.operations = [];
        this.signatures = [];
        this.extensions = [];
    }
}
const DefaultOptions = {
    tx: new DefaultTrParams(),
    skipUpdate: false,
    txExpiration: 30,
    expire_in_secs_proposal: 60 * 60,
    review_in_secs_committee: 60 * 60 * 24,
    debug: false
};
class TransactionBuilder {
    constructor(wsConnect, options) {
        this.wsConnect = wsConnect;
        this.signer_private_keys = [];
        this.opManager = Operation_1.OperationManager.getOpManager();
        this.signed = false;
        this.chain_id = "";
        this.options = Object.assign({}, DefaultOptions, options);
        this.tx = (options && options.tx) || new DefaultTrParams();
        if (!this.options.debug) {
            this.debugLog = () => void 0;
        }
    }
    /**
          @arg {string} name - like "transfer"
          @arg {object} operation - JSON matchching the operation's format
      */
    add_type_operation(name, operation) {
        this.add_operation(this.get_type_operation(name, operation));
        return;
    }
    /** Typically this is called automatically just prior to signing.  Once finalized this transaction can not be changed. */
    finalize(refBlockHeader) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.skipUpdate && !refBlockHeader) {
                this.debugLog("[Finalize Begin]", this.tx);
                let gdp = (yield this.wsConnect.api("database")("get_objects")(["2.1.0"]))[0];
                let refHeader = {
                    block_num: gdp.last_irreversible_block_num - 1,
                    block_id: (yield this.wsConnect.api("database")("get_block_header")(gdp.last_irreversible_block_num)).previous
                };
                this.tx.ref_block_num = refHeader.block_num & 0xffff;
                this.tx.ref_block_prefix = Buffer.from(refHeader.block_id, "hex").readUInt32LE(4);
                if (!this.tx.expiration) {
                    this.tx.expiration = base_expiration_sec() + this.options.txExpiration;
                }
            }
            var iterable = this.tx.operations;
            for (var i = 0; i < iterable.length; i++) {
                let op = iterable[i];
                if (op[1]["finalize"]) {
                    op[1].finalize();
                }
            }
            this.tr_buffer = serializer_1.ops.transaction.toBuffer(this.tx);
            this.debugLog("[Finalize]", this.tx, this.tr_buffer);
            return;
        });
    }
    /** @return {string} hex transaction ID */
    id() {
        if (!this.tr_buffer) {
            throw new Error("not finalized");
        }
        return ecc_1.hash
            .sha256(this.tr_buffer)
            .toString("hex")
            .substring(0, 40);
    }
    /**
          Typically one will use {@link this.add_type_operation} instead.
          @arg {array} operation - [operation_id, operation]
      */
    add_operation(operation) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        assert_1.default(operation, "operation");
        if (!Array.isArray(operation)) {
            throw new Error("Expecting array [operation_id, operation]");
        }
        this.tx.operations.push(operation);
        return;
    }
    get_type_operation(name, operation) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        assert_1.default(name, "name");
        assert_1.default(operation, "operation");
        let op = this.opManager.getOperationByName(name);
        assert_1.default(op, `Unknown operation ${name}`);
        let operation_id = op.opID;
        if (operation_id === undefined) {
            throw new Error(`unknown operation: ${name}`);
        }
        if (!operation.fee) {
            operation.fee = { amount: 0, asset_id: 0 };
        }
        if (name === "proposal_create") {
            /*
             * Proposals involving the committee account require a review
             * period to be set, look for them here
             */
            let requiresReview = false, extraReview = 0;
            try {
                console.log("[get_type_operation]", "[propose]", JSON.stringify(operation));
            }
            catch (e) {
                console.error("[get_type_operation]", "[propose]", e);
            }
            operation.proposed_ops.forEach(op => {
                const COMMITTE_ACCOUNT = 0;
                let key;
                switch (op.op[0]) {
                    case 0: // transfer
                        key = "from";
                        break;
                    case 6: //account_update
                    case 17: // asset_settle
                        key = "account";
                        break;
                    case 10: // asset_create
                    case 11: // asset_update
                    case 12: // asset_update_bitasset
                    case 13: // asset_update_feed_producers
                    case 14: // asset_issue
                    case 18: // asset_global_settle
                    case 43: // asset_claim_fees
                        key = "issuer";
                        break;
                    case 15: // asset_reserve
                        key = "payer";
                        break;
                    case 16: // asset_fund_fee_pool
                        key = "from_account";
                        break;
                    case 22: // proposal_create
                    case 23: // proposal_update
                    case 24: // proposal_delete
                        key = "fee_paying_account";
                        break;
                    case 45: // initiate_crowdfund
                        key = "owner";
                        break;
                    case 31: // committee_member_update_global_parameters
                        requiresReview = true;
                        extraReview = 60 * 60 * 24 * 13; // Make the review period 2 weeks total
                        break;
                }
                if (key in op.op[1] && op.op[1][key] === COMMITTE_ACCOUNT) {
                    requiresReview = true;
                }
            });
            operation.expiration_time ||
                (operation.expiration_time =
                    base_expiration_sec() + this.options.expire_in_secs_proposal);
            if (requiresReview) {
                operation.review_period_seconds =
                    extraReview +
                        Math.max(committee_min_review, 24 * 60 * 60 || this.options.review_in_secs_committee);
                /*
                 * Expiration time must be at least equal to
                 * now + review_period_seconds, so we add one hour to make sure
                 */
                operation.expiration_time += 60 * 60 + extraReview;
            }
        }
        let operation_instance = op.serializer.fromObject(operation);
        return [operation_id, operation_instance];
    }
    /* optional: fetch the current head block */
    update_head_block() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                this.wsConnect.api("database")("get_objects")(["2.0.0"]),
                this.wsConnect.api("database")("get_objects")(["2.1.0"])
            ]).then(function (res) {
                let [g, r] = res;
                head_block_time_string = r[0].time;
                committee_min_review = g[0].parameters.committee_proposal_review_period;
            });
        });
    }
    debugLog(...params) {
        try {
            console.debug(...params);
        }
        catch (e) {
            console.error(e);
        }
    }
    /** optional: there is a deafult expiration */
    set_expire_seconds(sec) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        return (this.tx.expiration = base_expiration_sec() + sec);
    }
    /* Wraps this transaction in a proposal_create transaction */
    propose(proposal_create_options) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        if (!this.tx.operations.length) {
            throw new Error("add operation first");
        }
        assert_1.default(proposal_create_options, "proposal_create_options");
        assert_1.default(proposal_create_options.fee_paying_account, "proposal_create_options.fee_paying_account");
        let proposed_ops = this.tx.operations.map((op) => {
            return { op: op };
        });
        this.tx.operations = [];
        this.tx.signatures = [];
        this.signer_private_keys = [];
        proposal_create_options.proposed_ops = proposed_ops;
        this.add_type_operation("proposal_create", proposal_create_options);
        return this;
    }
    has_proposed_operation() {
        let hasProposed = false;
        for (var i = 0; i < this.tx.operations.length; i++) {
            if ("proposed_ops" in this.tx.operations[i][1]) {
                hasProposed = true;
                break;
            }
        }
        return hasProposed;
    }
    /** optional: the fees can be obtained from the witness node */
    set_required_fees(asset_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let fee_pool;
            if (this.tr_buffer) {
                throw new Error("already finalized");
            }
            if (!this.tx.operations.length) {
                throw new Error("add operations first");
            }
            let operations = [];
            for (let i = 0, op; i < this.tx.operations.length; i++) {
                op = this.tx.operations[i];
                let opObject = this.opManager
                    .getOperationByOpID(op[0])
                    .serializer.toObject(op[1]);
                operations.push([op[0], opObject]);
            }
            if (!asset_id) {
                let op1_fee = operations[0][1].fee;
                if (op1_fee && op1_fee.asset_id !== null) {
                    asset_id = op1_fee.asset_id;
                }
                else {
                    asset_id = "1.3.0";
                }
            }
            let promises = [
                this.wsConnect.api("database")("get_required_fees")(operations, asset_id)
            ];
            if (asset_id !== "1.3.0") {
                // This handles the fallback to paying fees in CYB if the fee pool is empty.
                promises.push(this.wsConnect.api("database")("get_required_fees")(operations, "1.3.0"));
                promises.push(this.wsConnect.api("database")("get_objects")([asset_id]));
            }
            let fees, coreFees, asset;
            return Promise.all(promises)
                .then(results => {
                [fees, coreFees, asset] = results;
                asset = asset ? asset[0] : null;
                let dynamicPromise = asset_id !== "1.3.0" && asset
                    ? this.wsConnect.api("database")("get_objects")([
                        asset.dynamic_asset_data_id
                    ])
                    : new Promise(resolve => resolve());
                return dynamicPromise;
            })
                .then(dynamicObject => {
                if (asset_id !== "1.3.0") {
                    fee_pool = dynamicObject ? dynamicObject[0].fee_pool : 0;
                    let totalFees = 0;
                    for (let j = 0, fee; j < coreFees.length; j++) {
                        fee = coreFees[j];
                        totalFees += fee.amount;
                    }
                    if (totalFees > parseInt(fee_pool, 10)) {
                        fees = coreFees;
                        asset_id = "1.3.0";
                    }
                }
                // Proposed transactions need to be flattened
                let flat_assets = [];
                let flatten = function (obj) {
                    if (Array.isArray(obj)) {
                        for (let k = 0, item; k < obj.length; k++) {
                            item = obj[k];
                            flatten(item);
                        }
                    }
                    else {
                        flat_assets.push(obj);
                    }
                    return;
                };
                flatten(fees);
                let asset_index = 0;
                let set_fee = (operation) => {
                    if (!operation.fee ||
                        operation.fee.amount === 0 ||
                        (operation.fee.amount.toString &&
                            operation.fee.amount.toString() === "0") // Long
                    ) {
                        operation.fee = flat_assets[asset_index];
                        // console.log("new operation.fee", operation.fee)
                    }
                    else {
                        // console.log("old operation.fee", operation.fee)
                    }
                    asset_index++;
                    if (operation.proposed_ops) {
                        let result = [];
                        for (let y = 0; y < operation.proposed_ops.length; y++)
                            result.push(set_fee(operation.proposed_ops[y].op[1]));
                        return result;
                    }
                };
                for (let i = 0; i < this.tx.operations.length; i++) {
                    set_fee(this.tx.operations[i][1]);
                }
            });
            //DEBUG console.log('... get_required_fees',operations,asset_id,flat_assets)
        });
    }
    get_potential_signatures() {
        return __awaiter(this, void 0, void 0, function* () {
            var tr_object = serializer_1.ops.signed_transaction.toObject(this);
            return Promise.all([
                this.wsConnect.api("database")("get_potential_signatures")(tr_object),
                this.wsConnect.api("database")("get_potential_address_signatures")(tr_object)
            ]).then(function (results) {
                return { pubkeys: results[0], addys: results[1] };
            });
        });
    }
    get_required_signatures(available_keys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!available_keys.length) {
                return Promise.resolve([]);
            }
            var tr_object = serializer_1.ops.signed_transaction.toObject(this);
            //DEBUG console.log('... tr_object',tr_object)
            return this.wsConnect
                .api("database")("get_required_signatures")(tr_object, available_keys)
                .then(function (required_public_keys) {
                //DEBUG console.log('... get_required_signatures',required_public_keys)
                return required_public_keys;
            });
        });
    }
    add_signer(private_key, public_key = private_key.toPublicKey()) {
        assert_1.default(private_key.d, "required PrivateKey object");
        if (this.signed) {
            throw new Error("already signed");
        }
        // prevent duplicates
        let spHex = private_key.toHex();
        for (let sp of this.signer_private_keys) {
            if (sp[0].toHex() === spHex)
                return;
        }
        this.signer_private_keys.push([private_key, public_key]);
    }
    sign(chain_id = this.wsConnect.chainID) {
        if (!this.tr_buffer) {
            throw new Error("not finalized");
        }
        if (this.signed) {
            throw new Error("already signed");
        }
        if (!this.signer_private_keys.length) {
            throw new Error("Transaction was not signed. Do you have a private key? [no_signers]");
        }
        var end = this.signer_private_keys.length;
        for (var i = 0; 0 < end ? i < end : i > end; 0 < end ? i++ : i++) {
            var [private_key] = this.signer_private_keys[i];
            var sig = ecc_1.Signature.signBuffer(Buffer.concat([Buffer.from(chain_id, "hex"), this.tr_buffer]), private_key);
            this.tx.signatures.push(sig.toBuffer());
        }
        this.signer_private_keys = [];
        this.signed = true;
        return;
    }
    serialize() {
        return serializer_1.ops.signed_transaction.toObject(this);
    }
    toObject() {
        return serializer_1.ops.signed_transaction.toObject(this);
    }
    _broadcast(was_broadcast_callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.debugLog("[_Broadcast]", this.tx);
            return new Promise((resolve, reject) => {
                if (!this.signed) {
                    this.sign();
                }
                if (!this.tr_buffer) {
                    throw new Error("not finalized");
                }
                if (!this.tx.signatures.length) {
                    throw new Error("not signed");
                }
                if (!this.tx.operations.length) {
                    throw new Error("no operations");
                }
                var tr_object = serializer_1.ops.signed_transaction.toObject(this.tx);
                // console.log('... broadcast_transaction_with_callback !!!')
                this.wsConnect
                    .api("network_broadcast")("broadcast_transaction_with_callback")(function (res) {
                    return resolve(res);
                }, tr_object)
                    .then(function () {
                    //console.log('... broadcast success, waiting for callback')
                    if (was_broadcast_callback)
                        was_broadcast_callback();
                    return;
                })
                    .catch((error) => {
                    // console.log may be redundant for network errors, other errors could occur
                    console.log(error);
                    var message = error.message;
                    if (!message) {
                        message = "";
                    }
                    reject(new Error(message +
                        "\n" +
                        "bitshares-crypto " +
                        " digest " +
                        ecc_1.hash.sha256(this.tr_buffer).toString("hex") +
                        " transaction " +
                        this.tr_buffer.toString("hex") +
                        " " +
                        JSON.stringify(tr_object)));
                    return;
                });
                return;
            });
        });
    }
    broadcast(was_broadcast_callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.debugLog("[Broadcast]", this.tr_buffer);
            if (this.tr_buffer) {
                return this._broadcast(was_broadcast_callback);
            }
            else {
                return this.finalize().then(() => {
                    return this._broadcast(was_broadcast_callback);
                });
            }
        });
    }
}
exports.TransactionBuilder = TransactionBuilder;
var base_expiration_sec = () => {
    return Math.ceil(Date.now() / 1000);
};
function getHeadBlockDate() {
    return timeStringToDate(head_block_time_string);
}
function timeStringToDate(time_string) {
    if (!time_string)
        return new Date("1970-01-01T00:00:00.000Z");
    if (!/Z$/.test(time_string))
        //does not end in Z
        // https://github.com/cryptonomex/graphene/issues/368
        time_string = time_string + "Z";
    return new Date(time_string);
}
exports.default = TransactionBuilder;
