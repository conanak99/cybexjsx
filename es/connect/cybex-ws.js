var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import EventEmitter from "wolfy87-eventemitter";
import assert from "assert";
import { convertResultUniversal } from "./rpc-models";
import WebSocket from "ws";
function getWebSocketClient() {
    if (typeof WebSocket !== "undefined" && typeof document !== "undefined") {
        return WebSocket;
    }
    return null;
}
var ChainWebSocket = /** @class */ (function (_super) {
    __extends(ChainWebSocket, _super);
    function ChainWebSocket(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.chainID = "";
        _this.apiIds = {};
        _this.cbs = {};
        _this.subs = {};
        _this.unsub = {};
        _this._callId = 1;
        return _this;
    }
    ChainWebSocket.getInstanceWithWs = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            var _config, ws;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _config = __assign({}, ChainWebSocket.DefaultWsConfig, config);
                        ws = new ChainWebSocket(__assign({ url: url }, _config));
                        return [4 /*yield*/, ws.connect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, ws];
                }
            });
        });
    };
    Object.defineProperty(ChainWebSocket.prototype, "callId", {
        get: function () {
            return this._callId++;
        },
        enumerable: true,
        configurable: true
    });
    ChainWebSocket.prototype.initState = function () {
        this._callId = 1;
        this.subs = {};
        this.cbs = {};
        this.unsub = {};
        this.apiIds = {};
    };
    ChainWebSocket.prototype.connect = function (restoreState) {
        if (restoreState === void 0) { restoreState = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _openEvent, rawSubs_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert(this.config.url, "Ws url must be provided");
                        this.initState();
                        return [4 /*yield*/, new Promise(function (resolve) {
                                _this.ws = new WebSocket(_this.config.url);
                                _this.ws.addEventListener("open", function (e) {
                                    console.info("WsConnect Open");
                                    resolve(e);
                                });
                                _this.ws.addEventListener("close", function (e) {
                                    _this.rejectAllCbs();
                                    _this.emit(ChainWebSocket.WsEvents.DISCONNECT, e);
                                    console.error("WsConnect Closed");
                                    if (_this.config.autoReconnect) {
                                        _this.connect(_this.config.autoRestoreStateAfterReconnect);
                                    }
                                });
                                _this.ws.addEventListener("message", function (msg) {
                                    _this.log(typeof msg.data, msg.data);
                                    _this.listener(convertResultUniversal(JSON.parse(msg.data)));
                                });
                            })];
                    case 1:
                        _openEvent = _a.sent();
                        return [4 /*yield*/, this.login()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.updateChainID()];
                    case 3:
                        _a.sent();
                        if (!restoreState) return [3 /*break*/, 5];
                        rawSubs_1 = this.subs;
                        return [4 /*yield*/, Promise.all(Object.keys(this.subs)
                                .map(function (id) { return rawSubs_1[id].rawCall; })
                                .map(function (call) { return _this.call(call.apiName, call.method, call.params); }))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ChainWebSocket.prototype.login = function (apis) {
        if (apis === void 0) { apis = this.config.apiTypes; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        assert(this.ws && this.ws.readyState === 1);
                        if (!apis) {
                            throw Error("Apis Error");
                        }
                        _a = this.apiIds;
                        _b = "login";
                        return [4 /*yield*/, this.api("login")("login")("", "")];
                    case 1:
                        _a[_b] = _c.sent();
                        return [2 /*return*/, Promise.all(apis.map(function (apiType) { return __awaiter(_this, void 0, void 0, function () {
                                var apiId;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.api("login")(apiType)()];
                                        case 1:
                                            apiId = _a.sent();
                                            this.apiIds[apiType] = apiId;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                }
            });
        });
    };
    ChainWebSocket.prototype.api = function (apiName) {
        var _this = this;
        return function (method) { return function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _this.call(apiName, method, params);
        }; };
    };
    ChainWebSocket.prototype.updateChainID = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.api("database")("get_chain_id")()];
                    case 1:
                        _a.chainID = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChainWebSocket.prototype.call = function (apiName, method, params) {
        if (params === void 0) { params = []; }
        return __awaiter(this, void 0, void 0, function () {
            var callId, apiId, unSubCb, id, request;
            var _this = this;
            return __generator(this, function (_a) {
                callId = this.callId;
                apiId = this.apiIds[apiName] || 1;
                if (this.ws.readyState !== 1) {
                    return [2 /*return*/, Promise.reject(new Error("websocket state error:" + this.ws.readyState))];
                }
                if (this.config.subMethods.has(method)) {
                    // Store callback in subs map
                    this.subs[callId] = {
                        rawCall: {
                            apiName: apiName,
                            method: method,
                            params: params.slice(),
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
                    unSubCb = params.splice(0, 1)[0];
                    // Find the corresponding subscription
                    for (id in this.subs) {
                        if (this.subs[id].callback === unSubCb) {
                            this.unsub[callId] = id;
                            break;
                        }
                    }
                }
                request = {
                    id: callId,
                    method: "call",
                    params: [apiId, method, params],
                };
                // this.send_life = max_send_life;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.cbs[callId] = {
                            time: new Date(),
                            resolve: resolve,
                            reject: reject,
                        };
                        _this.ws.send(JSON.stringify(request));
                    })];
            });
        });
    };
    ChainWebSocket.prototype.listener = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, response
                        .then(function (res) { return _this.pickCallback(res.id, res.isSub).resolve(res.result); })
                        .catch(function (errRes) {
                        console.error("Error Response: ", errRes);
                        _this.pickCallback(errRes.id).reject(errRes.result);
                    })
                        .catch(function (err) { return console.error("RPC Response Error: ", err); })];
            });
        });
    };
    ChainWebSocket.prototype.pickCallback = function (id, isSub) {
        if (isSub === void 0) { isSub = false; }
        this.log("[PickCallback]", id, this.cbs);
        var callback;
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
    };
    ChainWebSocket.prototype.rejectAllCbs = function () {
        var _this = this;
        Object.keys(this.cbs).forEach(function (id) {
            return _this.listener(convertResultUniversal({
                jsonrpc: "2.0",
                error: "Connection Closed",
                id: id,
            }));
        });
    };
    ChainWebSocket.prototype.close = function () {
        this.ws.close();
    };
    ChainWebSocket.prototype.log = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (this.config.debugMode) {
            console.log.apply(console, params);
        }
    };
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
    return ChainWebSocket;
}(EventEmitter));
export { ChainWebSocket };
export default ChainWebSocket;
