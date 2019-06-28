export interface RPCResult {
  id: number;
  jsonrpc: "2.0";
  result: any;
}
export interface RPCRejectResult {
  id: number;
  jsonrpc: "2.0";
  error: any;
}
type CallID = number;
type ApiID = number;
type Method = string;
type Params = any[];
type NoticeArray = any[];
export type RPCRequestParams = [ApiID, Method, Params];

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

export const convertResultUniversal: (
  result: RPCResult | RPCRejectResult | RPCNotice
) => Promise<RPCResultUniversal> = async result =>
  "error" in result
    ? Promise.reject({ result: result.error, id: result.id })
    : "result" in result
    ? Promise.resolve({ result: result.result, id: result.id, isSub: false })
    : Promise.resolve({
        result: result.params[1],
        id: result.params[0],
        isSub: true
      });
