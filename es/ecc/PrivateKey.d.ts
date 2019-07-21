/// <reference types="node" />
import ecurve from "ecurve";
import PublicKey from "./PublicKey";
declare class PrivateKey {
    d: any;
    public_key: PublicKey | undefined;
    appendByteBuffer: any;
    /**
     *      @private see static functions
     *     @param {BigInteger}
     */
    constructor(d: any);
    static fromBuffer(buf: any): PrivateKey;
    /** @arg {string} seed - any length string.  This is private, the same seed produces the same private key every time.  */
    static fromSeed(seed: any): PrivateKey;
    /** @return {string} Wallet Import Format (still a secret, Not encrypted) */
    static fromWif(_private_wif: any): PrivateKey;
    static fromHex(hex: any): PrivateKey;
    toWif(): string;
    /**
     *    @return {Point}
     */
    toPublicKeyPoint(): ecurve.Point;
    toPublicKey(): PublicKey;
    toBuffer(): any;
    /** ECIES */
    get_shared_secret(public_key: any, legacy?: boolean): Buffer;
    /** @throws {Error} - overflow of the key could not be derived */
    child(offset: any): PrivateKey;
    toByteBuffer(): any;
    toHex(): any;
}
export default PrivateKey;
