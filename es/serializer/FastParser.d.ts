/// <reference types="node" />
import PublicKey from "../ecc/PublicKey";
declare class FastParser {
    static fixed_data(b: any, len: any, buffer?: any): Buffer;
    static public_key(b: any, public_key?: any): PublicKey;
    static ripemd160(b: any, ripemd160?: any): Buffer;
    static time_point_sec(b: any, epoch: any): Date;
}
export default FastParser;
