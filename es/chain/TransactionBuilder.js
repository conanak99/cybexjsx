var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import assert from "assert";
import { Signature, hash } from "../ecc";
import { ops } from "../serializer";
import { OperationManager } from "./Operation";
var head_block_time_string, committee_min_review;
var DefaultTrParams = /** @class */ (function () {
    function DefaultTrParams() {
        this.ref_block_num = 0;
        this.ref_block_prefix = 0;
        this.expiration = 0;
        this.operations = [];
        this.signatures = [];
        this.extensions = [];
    }
    return DefaultTrParams;
}());
var DefaultOptions = {
    tx: new DefaultTrParams(),
    skipUpdate: false,
    txExpiration: 30,
    expire_in_secs_proposal: 60 * 60,
    review_in_secs_committee: 60 * 60 * 24,
    debug: false
};
var TransactionBuilder = /** @class */ (function () {
    function TransactionBuilder(wsConnect, options) {
        this.wsConnect = wsConnect;
        this.signer_private_keys = [];
        this.opManager = OperationManager.getOpManager();
        this.signed = false;
        this.chain_id = "";
        this.options = __assign({}, DefaultOptions, options);
        this.tx = (options && options.tx) || new DefaultTrParams();
        if (!this.options.debug) {
            this.debugLog = function () { return void 0; };
        }
    }
    /**
          @arg {string} name - like "transfer"
          @arg {object} operation - JSON matchching the operation's format
      */
    TransactionBuilder.prototype.add_type_operation = function (name, operation) {
        this.add_operation(this.get_type_operation(name, operation));
        return;
    };
    /** Typically this is called automatically just prior to signing.  Once finalized this transaction can not be changed. */
    TransactionBuilder.prototype.finalize = function (refBlockHeader) {
        return __awaiter(this, void 0, void 0, function () {
            var gdp, refHeader, _a, iterable, i, op;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(!this.options.skipUpdate && !refBlockHeader)) return [3 /*break*/, 3];
                        this.debugLog("[Finalize Begin]", this.tx);
                        return [4 /*yield*/, this.wsConnect.api("database")("get_objects")(["2.1.0"])];
                    case 1:
                        gdp = (_b.sent())[0];
                        _a = {
                            block_num: gdp.last_irreversible_block_num - 1
                        };
                        return [4 /*yield*/, this.wsConnect.api("database")("get_block_header")(gdp.last_irreversible_block_num)];
                    case 2:
                        refHeader = (_a.block_id = (_b.sent()).previous,
                            _a);
                        this.tx.ref_block_num = refHeader.block_num & 0xffff;
                        this.tx.ref_block_prefix = Buffer.from(refHeader.block_id, "hex").readUInt32LE(4);
                        if (!this.tx.expiration) {
                            this.tx.expiration = base_expiration_sec() + this.options.txExpiration;
                        }
                        _b.label = 3;
                    case 3:
                        iterable = this.tx.operations;
                        for (i = 0; i < iterable.length; i++) {
                            op = iterable[i];
                            if (op[1]["finalize"]) {
                                op[1].finalize();
                            }
                        }
                        this.tr_buffer = ops.transaction.toBuffer(this.tx);
                        this.debugLog("[Finalize]", this.tx, this.tr_buffer);
                        return [2 /*return*/];
                }
            });
        });
    };
    /** @return {string} hex transaction ID */
    TransactionBuilder.prototype.id = function () {
        if (!this.tr_buffer) {
            throw new Error("not finalized");
        }
        return hash
            .sha256(this.tr_buffer)
            .toString("hex")
            .substring(0, 40);
    };
    /**
          Typically one will use {@link this.add_type_operation} instead.
          @arg {array} operation - [operation_id, operation]
      */
    TransactionBuilder.prototype.add_operation = function (operation) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        assert(operation, "operation");
        if (!Array.isArray(operation)) {
            throw new Error("Expecting array [operation_id, operation]");
        }
        this.tx.operations.push(operation);
        return;
    };
    TransactionBuilder.prototype.get_type_operation = function (name, operation) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        assert(name, "name");
        assert(operation, "operation");
        var op = this.opManager.getOperationByName(name);
        assert(op, "Unknown operation " + name);
        var operation_id = op.opID;
        if (operation_id === undefined) {
            throw new Error("unknown operation: " + name);
        }
        if (!operation.fee) {
            operation.fee = { amount: 0, asset_id: 0 };
        }
        if (name === "proposal_create") {
            /*
             * Proposals involving the committee account require a review
             * period to be set, look for them here
             */
            var requiresReview_1 = false, extraReview_1 = 0;
            try {
                console.log("[get_type_operation]", "[propose]", JSON.stringify(operation));
            }
            catch (e) {
                console.error("[get_type_operation]", "[propose]", e);
            }
            operation.proposed_ops.forEach(function (op) {
                var COMMITTE_ACCOUNT = 0;
                var key;
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
                        requiresReview_1 = true;
                        extraReview_1 = 60 * 60 * 24 * 13; // Make the review period 2 weeks total
                        break;
                }
                if (key in op.op[1] && op.op[1][key] === COMMITTE_ACCOUNT) {
                    requiresReview_1 = true;
                }
            });
            operation.expiration_time ||
                (operation.expiration_time =
                    base_expiration_sec() + this.options.expire_in_secs_proposal);
            if (requiresReview_1) {
                operation.review_period_seconds =
                    extraReview_1 +
                        Math.max(committee_min_review, 24 * 60 * 60 || this.options.review_in_secs_committee);
                /*
                 * Expiration time must be at least equal to
                 * now + review_period_seconds, so we add one hour to make sure
                 */
                operation.expiration_time += 60 * 60 + extraReview_1;
            }
        }
        var operation_instance = op.serializer.fromObject(operation);
        return [operation_id, operation_instance];
    };
    /* optional: fetch the current head block */
    TransactionBuilder.prototype.update_head_block = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all([
                        this.wsConnect.api("database")("get_objects")(["2.0.0"]),
                        this.wsConnect.api("database")("get_objects")(["2.1.0"])
                    ]).then(function (res) {
                        var g = res[0], r = res[1];
                        head_block_time_string = r[0].time;
                        committee_min_review = g[0].parameters.committee_proposal_review_period;
                    })];
            });
        });
    };
    TransactionBuilder.prototype.debugLog = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        try {
            console.debug.apply(console, params);
        }
        catch (e) {
            console.error(e);
        }
    };
    /** optional: there is a deafult expiration */
    TransactionBuilder.prototype.set_expire_seconds = function (sec) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        return (this.tx.expiration = base_expiration_sec() + sec);
    };
    /* Wraps this transaction in a proposal_create transaction */
    TransactionBuilder.prototype.propose = function (proposal_create_options) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        if (!this.tx.operations.length) {
            throw new Error("add operation first");
        }
        assert(proposal_create_options, "proposal_create_options");
        assert(proposal_create_options.fee_paying_account, "proposal_create_options.fee_paying_account");
        var proposed_ops = this.tx.operations.map(function (op) {
            return { op: op };
        });
        this.tx.operations = [];
        this.tx.signatures = [];
        this.signer_private_keys = [];
        proposal_create_options.proposed_ops = proposed_ops;
        this.add_type_operation("proposal_create", proposal_create_options);
        return this;
    };
    TransactionBuilder.prototype.has_proposed_operation = function () {
        var hasProposed = false;
        for (var i = 0; i < this.tx.operations.length; i++) {
            if ("proposed_ops" in this.tx.operations[i][1]) {
                hasProposed = true;
                break;
            }
        }
        return hasProposed;
    };
    /** optional: the fees can be obtained from the witness node */
    TransactionBuilder.prototype.set_required_fees = function (asset_id) {
        return __awaiter(this, void 0, void 0, function () {
            var fee_pool, operations, i, op, opObject, op1_fee, promises, fees, coreFees, asset;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.tr_buffer) {
                    throw new Error("already finalized");
                }
                if (!this.tx.operations.length) {
                    throw new Error("add operations first");
                }
                operations = [];
                for (i = 0, op = void 0; i < this.tx.operations.length; i++) {
                    op = this.tx.operations[i];
                    opObject = this.opManager
                        .getOperationByOpID(op[0])
                        .serializer.toObject(op[1]);
                    operations.push([op[0], opObject]);
                }
                if (!asset_id) {
                    op1_fee = operations[0][1].fee;
                    if (op1_fee && op1_fee.asset_id !== null) {
                        asset_id = op1_fee.asset_id;
                    }
                    else {
                        asset_id = "1.3.0";
                    }
                }
                promises = [
                    this.wsConnect.api("database")("get_required_fees")(operations, asset_id)
                ];
                if (asset_id !== "1.3.0") {
                    // This handles the fallback to paying fees in CYB if the fee pool is empty.
                    promises.push(this.wsConnect.api("database")("get_required_fees")(operations, "1.3.0"));
                    promises.push(this.wsConnect.api("database")("get_objects")([asset_id]));
                }
                return [2 /*return*/, Promise.all(promises)
                        .then(function (results) {
                        fees = results[0], coreFees = results[1], asset = results[2];
                        asset = asset ? asset[0] : null;
                        var dynamicPromise = asset_id !== "1.3.0" && asset
                            ? _this.wsConnect.api("database")("get_objects")([
                                asset.dynamic_asset_data_id
                            ])
                            : new Promise(function (resolve) { return resolve(); });
                        return dynamicPromise;
                    })
                        .then(function (dynamicObject) {
                        if (asset_id !== "1.3.0") {
                            fee_pool = dynamicObject ? dynamicObject[0].fee_pool : 0;
                            var totalFees = 0;
                            for (var j = 0, fee = void 0; j < coreFees.length; j++) {
                                fee = coreFees[j];
                                totalFees += fee.amount;
                            }
                            if (totalFees > parseInt(fee_pool, 10)) {
                                fees = coreFees;
                                asset_id = "1.3.0";
                            }
                        }
                        // Proposed transactions need to be flattened
                        var flat_assets = [];
                        var flatten = function (obj) {
                            if (Array.isArray(obj)) {
                                for (var k = 0, item = void 0; k < obj.length; k++) {
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
                        var asset_index = 0;
                        var set_fee = function (operation) {
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
                                var result = [];
                                for (var y = 0; y < operation.proposed_ops.length; y++)
                                    result.push(set_fee(operation.proposed_ops[y].op[1]));
                                return result;
                            }
                        };
                        for (var i = 0; i < _this.tx.operations.length; i++) {
                            set_fee(_this.tx.operations[i][1]);
                        }
                    })];
            });
        });
    };
    TransactionBuilder.prototype.get_potential_signatures = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tr_object;
            return __generator(this, function (_a) {
                tr_object = ops.signed_transaction.toObject(this);
                return [2 /*return*/, Promise.all([
                        this.wsConnect.api("database")("get_potential_signatures")(tr_object),
                        this.wsConnect.api("database")("get_potential_address_signatures")(tr_object)
                    ]).then(function (results) {
                        return { pubkeys: results[0], addys: results[1] };
                    })];
            });
        });
    };
    TransactionBuilder.prototype.get_required_signatures = function (available_keys) {
        return __awaiter(this, void 0, void 0, function () {
            var tr_object;
            return __generator(this, function (_a) {
                if (!available_keys.length) {
                    return [2 /*return*/, Promise.resolve([])];
                }
                tr_object = ops.signed_transaction.toObject(this);
                //DEBUG console.log('... tr_object',tr_object)
                return [2 /*return*/, this.wsConnect
                        .api("database")("get_required_signatures")(tr_object, available_keys)
                        .then(function (required_public_keys) {
                        //DEBUG console.log('... get_required_signatures',required_public_keys)
                        return required_public_keys;
                    })];
            });
        });
    };
    TransactionBuilder.prototype.add_signer = function (private_key, public_key) {
        if (public_key === void 0) { public_key = private_key.toPublicKey(); }
        assert(private_key.d, "required PrivateKey object");
        if (this.signed) {
            throw new Error("already signed");
        }
        // prevent duplicates
        var spHex = private_key.toHex();
        for (var _i = 0, _a = this.signer_private_keys; _i < _a.length; _i++) {
            var sp = _a[_i];
            if (sp[0].toHex() === spHex)
                return;
        }
        this.signer_private_keys.push([private_key, public_key]);
    };
    TransactionBuilder.prototype.sign = function (chain_id) {
        if (chain_id === void 0) { chain_id = this.wsConnect.chainID; }
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
            var private_key = this.signer_private_keys[i][0];
            var sig = Signature.signBuffer(Buffer.concat([Buffer.from(chain_id, "hex"), this.tr_buffer]), private_key);
            this.tx.signatures.push(sig.toBuffer());
        }
        this.signer_private_keys = [];
        this.signed = true;
        return;
    };
    TransactionBuilder.prototype.serialize = function () {
        return ops.signed_transaction.toObject(this);
    };
    TransactionBuilder.prototype.toObject = function () {
        return ops.signed_transaction.toObject(this);
    };
    TransactionBuilder.prototype._broadcast = function (was_broadcast_callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.debugLog("[_Broadcast]", this.tx);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!_this.signed) {
                            _this.sign();
                        }
                        if (!_this.tr_buffer) {
                            throw new Error("not finalized");
                        }
                        if (!_this.tx.signatures.length) {
                            throw new Error("not signed");
                        }
                        if (!_this.tx.operations.length) {
                            throw new Error("no operations");
                        }
                        var tr_object = ops.signed_transaction.toObject(_this.tx);
                        // console.log('... broadcast_transaction_with_callback !!!')
                        _this.wsConnect
                            .api("network_broadcast")("broadcast_transaction_with_callback")(function (res) {
                            return resolve(res);
                        }, tr_object)
                            .then(function () {
                            //console.log('... broadcast success, waiting for callback')
                            if (was_broadcast_callback)
                                was_broadcast_callback();
                            return;
                        })
                            .catch(function (error) {
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
                                hash.sha256(_this.tr_buffer).toString("hex") +
                                " transaction " +
                                _this.tr_buffer.toString("hex") +
                                " " +
                                JSON.stringify(tr_object)));
                            return;
                        });
                        return;
                    })];
            });
        });
    };
    TransactionBuilder.prototype.broadcast = function (was_broadcast_callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.debugLog("[Broadcast]", this.tr_buffer);
                if (this.tr_buffer) {
                    return [2 /*return*/, this._broadcast(was_broadcast_callback)];
                }
                else {
                    return [2 /*return*/, this.finalize().then(function () {
                            return _this._broadcast(was_broadcast_callback);
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    return TransactionBuilder;
}());
export { TransactionBuilder };
var base_expiration_sec = function () {
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
export default TransactionBuilder;
