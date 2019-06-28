import EventEmitter from "wolfy87-eventemitter";
import assert from "assert";
import { RPCResultUniversal, convertResultUniversal } from "./rpc-models";

function getWebSocketClient() {
  if (typeof WebSocket !== "undefined" && typeof document !== "undefined") {
    return WebSocket;
  }
  return null;
}

type ChainWsConfig = {
  wsClient: typeof WebSocket;
  keepAliveInterval: number;
  maxSendLife: number;
  maxRecvLife: number;
  url: string;
  autoRestoreStateAfterReconnect: boolean;
  subMethods: Set<string>;
  unsubMethods: Set<string>;
  apiTypes: string[];
};

class ChainWebSocket extends EventEmitter {
  static WsEvents = {
    DISCONNECT: "DISCONNECT"
  };
  static DefaultSubMothods = new Set([
    "set_subscribe_callback",
    "subscribe_to_market",
    "broadcast_transaction_with_callback",
    "set_pending_transaction_callback"
  ]);
  static DefaultUnsubMothods = new Set([
    "unsubscribe_from_accounts",
    "unsubscribe_from_market"
  ]);
  static DefaultApiType = ["database", "history", "network"];
  static DefaultWsConfig: Partial<ChainWsConfig> = {
    wsClient: getWebSocketClient(),
    apiTypes: ChainWebSocket.DefaultApiType,
    subMethods: ChainWebSocket.DefaultSubMothods,
    unsubMethods: ChainWebSocket.DefaultUnsubMothods,
    autoRestoreStateAfterReconnect: false
  };
  static async getInstanceWithWs(
    url: string,
    config?: Partial<ChainWsConfig>
  ): Promise<ChainWebSocket> {
    let _config = { ...config, ...ChainWebSocket.DefaultWsConfig };
    let ws = new ChainWebSocket({ url, ..._config } as any);
    await ws.connect();
    return ws;
  }

  apiIds = {};
  cbs = {};
  subs: {
    [id: string]: {
      rawCall: {
        apiName: string;
        method: string;
        params: any[];
      };
      callback: CallableFunction;
    };
  } = {};
  unsub = {};
  ws: WebSocket;
  _callId = 1;

  get callId() {
    return this._callId++;
  }

  constructor(public config: ChainWsConfig) {
    super();
  }
  initState() {
    this._callId = 1;
    this.subs = {};
    this.cbs = {};
    this.unsub = {};
    this.apiIds = {};
  }
  async connect(restoreState = false) {
    assert(this.config.url, "Ws url must be provided");
    this.initState();
    let _openEvent = await new Promise(resolve => {
      this.ws = new WebSocket(this.config.url);
      this.ws.addEventListener("open", (e: any) => {
        console.info("WsConnect Open");
        resolve(e);
      });
      this.ws.addEventListener("close", (e: any) => {
        this.emit(ChainWebSocket.WsEvents.DISCONNECT, e);
        console.error("WsConnect Closed");
        this.connect(this.config.autoRestoreStateAfterReconnect);
      });
      this.ws.addEventListener("message", msg =>
        this.listener(convertResultUniversal(msg.data))
      );
    });
    await this.login();
    if (restoreState) {
      let rawSubs = this.subs;
      await Promise.all(
        Object.keys(this.subs)
          .map(id => rawSubs[id].rawCall)
          .map(call => this.call(call.apiName, call.method, call.params))
      );
    }
  }

  async login(apis = this.config.apiTypes) {
    assert(this.ws && this.ws.readyState === 1);
    if (!apis) {
      throw Error("Apis Error");
    }
    this.apiIds["login"] = await this.api("login")("login", "", "");
    return Promise.all(
      apis.map(async apiType => {
        let apiId = await this.api("login")(apiType);
        this.apiIds[apiType] = apiId;
      })
    );
  }

  api(apiName: string) {
    return (method: string, ...rest: any[]) =>
      this.call.bind(this, apiName, method, rest);
  }

  async call(apiName: string, method: string, params: any[]) {
    let callId = this.callId;
    let apiId = this.apiIds[apiName] || 1;
    if (this.ws.readyState !== 1) {
      return Promise.reject(
        new Error("websocket state error:" + this.ws.readyState)
      );
    }

    if (this.config.subMethods.has(method)) {
      // Store callback in subs map
      this.subs[callId] = {
        rawCall: {
          apiName,
          method,
          params: [...params]
        },
        callback: params[0]
      };

      // Replace callback with the callback id
      params[0] = callId;
    }

    if (this.config.unsubMethods.has(method)) {
      if (typeof params[0] !== "function") {
        throw new Error(
          "First parameter of unsub must be the original callback"
        );
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
      params: [apiId, method, params]
    };
    // this.send_life = max_send_life;

    return new Promise((resolve, reject) => {
      this.cbs[callId] = {
        time: new Date(),
        resolve,
        reject
      };
      this.ws.send(JSON.stringify(request));
    });
  }

  pickCallback(
    id: string | number,
    isSub = false
  ): { resolve: CallableFunction; reject: CallableFunction } {
    let callback;
    if (!isSub) {
      callback = this.cbs[id];
      delete this.cbs[id];
      if (this.unsub[id]) {
        delete this.subs[this.unsub[id]];
        delete this.unsub[id];
      }
    } else {
      callback = { resolve: this.subs[id].callback };
    }
    return callback;
  }

  async listener(response: Promise<RPCResultUniversal>) {
    return response
      .then(res => this.pickCallback(res.id, res.isSub).resolve(res.result))
      .catch((errRes: RPCResultUniversal) =>
        this.pickCallback(errRes.id).reject(errRes.result)
      )
      .catch(err => console.error("RPC Response Error: ", err));
  }
}

export default ChainWebSocket;
