/// <reference types="node" />
import { Point } from "ecurve";
declare class PublicKey {
    Q: Point;
    /** @param {Point} public key */
    constructor(Q: Point);
    static fromBinary(bin: string): PublicKey;
    static fromBuffer(buffer: Buffer): PublicKey;
    static fromPoint(point: any): PublicKey;
    /**
     *  @arg {string} public_key - like GPHXyz...
     *  @arg {string} address_prefix - like GPH
     *  @return PublicKey or `null` (if the public_key string is invalid)
     */
    static fromPublicKeyString(public_key: string, address_prefix?: string): PublicKey;
    /**
     *   @arg {string} public_key - like GPHXyz...
     *   @arg {string} address_prefix - like GPH
     *   @throws {Error} if public key is invalid
     *   @return PublicKey
     */
    static fromStringOrThrow(public_key: string, address_prefix?: string): PublicKey;
    static fromHex(hex: string): PublicKey;
    static fromPublicKeyStringHex(hex: string): PublicKey;
    toBuffer(compressed?: any): Buffer;
    toUncompressed(): PublicKey;
    /** cyb::blockchain::address (unique but not a full public key) */
    toBlockchainAddress(): Buffer;
    /** Alias for {@link toPublicKeyString} */
    toString(address_prefix?: string): string;
    /**
     *     Full public key
     *    {return} string
     */
    toPublicKeyString(address_prefix?: string): string;
    toAddressString(address_prefix?: string): string;
    toPtsAddy(): string;
    child(offset: any): PublicKey;
    toHex(): string;
}
export default PublicKey;
