export interface RPCResult {
    id: CallID;
    jsonrpc: "2.0";
    result: any;
}
export interface RPCRejectResult {
    id: CallID;
    jsonrpc: "2.0";
    error: any;
}
declare type CallID = number | string;
declare type ApiID = number;
declare type Method = string;
declare type Params = any[];
declare type NoticeArray = any[];
export declare type RPCRequestParams = [ApiID, Method, Params];
export interface RPCRequest {
    id: CallID;
    method: "call";
    params: RPCRequestParams;
}
export interface RPCNotice {
    method: "notice";
    params: [CallID, NoticeArray];
}
export interface RPCResultUniversal {
    id: CallID;
    result: any;
    isSub: boolean;
}
export declare const convertResultUniversal: (result: RPCResult | RPCRejectResult | RPCNotice) => Promise<RPCResultUniversal>;
export {};
