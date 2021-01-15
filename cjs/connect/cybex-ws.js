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
const wolfy87_eventemitter_1 = __importDefault(require("wolfy87-eventemitter"));
const assert_1 = __importDefault(require("assert"));
const rpc_models_1 = require("./rpc-models");
const ws_1 = __importDefault(require("ws"));
function getWebSocketClient() {
    if (typeof ws_1.default !== "undefined" && typeof document !== "undefined") {
        return ws_1.default;
    }
    return null;
}
class ChainWebSocket extends wolfy87_eventemitter_1.default {
    constructor(config) {
        super();
        this.config = config;
        this.chainID = "";
        this.apiIds = {};
        this.cbs = {};
        this.subs = {};
        this.unsub = {};
        this._callId = 1;
    }
    static getInstanceWithWs(url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            let _config = Object.assign({}, ChainWebSocket.DefaultWsConfig, config);
            let ws = new ChainWebSocket(Object.assign({ url }, _config));
            yield ws.connect();
            return ws;
        });
    }
    get callId() {
        return this._callId++;
    }
    initState() {
        this._callId = 1;
        this.subs = {};
        this.cbs = {};
        this.unsub = {};
        this.apiIds = {};
    }
    connect(restoreState = false) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.default(this.config.url, "Ws url must be provided");
            this.initState();
            let _openEvent = yield new Promise((resolve) => {
                this.ws = new ws_1.default(this.config.url);
                this.ws.addEventListener("open", (e) => {
                    console.info("WsConnect Open");
                    resolve(e);
                });
                this.ws.addEventListener("close", (e) => {
                    this.rejectAllCbs();
                    this.emit(ChainWebSocket.WsEvents.DISCONNECT, e);
                    console.error("WsConnect Closed");
                    if (this.config.autoReconnect) {
                        this.connect(this.config.autoRestoreStateAfterReconnect);
                    }
                });
                this.ws.addEventListener("message", (msg) => {
                    this.log(typeof msg.data, msg.data);
                    this.listener(rpc_models_1.convertResultUniversal(JSON.parse(msg.data)));
                });
            });
            yield this.login();
            yield this.updateChainID();
            if (restoreState) {
                let rawSubs = this.subs;
                yield Promise.all(Object.keys(this.subs)
                    .map((id) => rawSubs[id].rawCall)
                    .map((call) => this.call(call.apiName, call.method, call.params)));
            }
        });
    }
    login(apis = this.config.apiTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.default(this.ws && this.ws.readyState === 1);
            if (!apis) {
                throw Error("Apis Error");
            }
            this.apiIds["login"] = yield this.api("login")("login")("", "");
            return Promise.all(apis.map((apiType) => __awaiter(this, void 0, void 0, function* () {
                let apiId = yield this.api("login")(apiType)();
                this.apiIds[apiType] = apiId;
            })));
        });
    }
    api(apiName) {
        return (method) => (...params) => this.call(apiName, method, params);
    }
    updateChainID() {
        return __awaiter(this, void 0, void 0, function* () {
            this.chainID = yield this.api("database")("get_chain_id")();
        });
    }
    call(apiName, method, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            let callId = this.callId;
            let apiId = this.apiIds[apiName] || 1;
            if (this.ws.readyState !== 1) {
                return Promise.reject(new Error("websocket state error:" + this.ws.readyState));
            }
            if (this.config.subMethods.has(method)) {
                // Store callback in subs map
                this.subs[callId] = {
                    rawCall: {
                        apiName,
                        method,
                        params: [...params],
                    },
                    callback: params[0],
                };
                // Replace callback with the callback id
                params[0] = callId;
            }
            if (this.config.unsubMethods.has(method)) {
                if (typeof params[0] !== "function") {
                    throw new Error("First parameter of unsub must be the original callback");
                }
                let unSubCb = params.splice(0, 1)[0];
                // Find the corresponding subscription
                for (let id in this.subs) {
                    if (this.subs[id].callback === unSubCb) {
                        this.unsub[callId] = id;
                        break;
                    }
                }
            }
            let request = {
                id: callId,
                method: "call",
                params: [apiId, method, params],
            };
            // this.send_life = max_send_life;
            return new Promise((resolve, reject) => {
                this.cbs[callId] = {
                    time: new Date(),
                    resolve,
                    reject,
                };
                this.ws.send(JSON.stringify(request));
            });
        });
    }
    listener(response) {
        return __awaiter(this, void 0, void 0, function* () {
            return response
                .then((res) => this.pickCallback(res.id, res.isSub).resolve(res.result))
                .catch((errRes) => {
                console.error("Error Response: ", errRes);
                this.pickCallback(errRes.id).reject(errRes.result);
            })
                .catch((err) => console.error("RPC Response Error: ", err));
        });
    }
    pickCallback(id, isSub = false) {
        this.log("[PickCallback]", id, this.cbs);
        let callback;
        if (!isSub) {
            callback = this.cbs[id];
            delete this.cbs[id];
            if (this.unsub[id]) {
                delete this.subs[this.unsub[id]];
                delete this.unsub[id];
            }
        }
        else {
            callback = { resolve: this.subs[id].callback };
        }
        return callback;
    }
    rejectAllCbs() {
        Object.keys(this.cbs).forEach((id) => this.listener(rpc_models_1.convertResultUniversal({
            jsonrpc: "2.0",
            error: "Connection Closed",
            id,
        })));
    }
    close() {
        this.ws.close();
    }
    log(...params) {
        if (this.config.debugMode) {
            console.log(...params);
        }
    }
}
ChainWebSocket.WsEvents = {
    DISCONNECT: "DISCONNECT",
};
ChainWebSocket.DefaultSubMothods = new Set([
    "set_subscribe_callback",
    "subscribe_to_market",
    "broadcast_transaction_with_callback",
    "set_pending_transaction_callback",
]);
ChainWebSocket.DefaultUnsubMothods = new Set([
    "unsubscribe_from_accounts",
    "unsubscribe_from_market",
]);
ChainWebSocket.DefaultApiType = ["database", "history", "network_broadcast"];
ChainWebSocket.DefaultWsConfig = {
    wsClient: getWebSocketClient(),
    apiTypes: ChainWebSocket.DefaultApiType,
    subMethods: ChainWebSocket.DefaultSubMothods,
    unsubMethods: ChainWebSocket.DefaultUnsubMothods,
    debugMode: false,
    autoRestoreStateAfterReconnect: false,
    autoReconnect: false,
};
exports.ChainWebSocket = ChainWebSocket;
exports.default = ChainWebSocket;
