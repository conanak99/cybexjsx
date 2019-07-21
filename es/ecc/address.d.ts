/// <reference types="node" />
import PublicKey from "./PublicKey";
/**
 * Addresses are shortened non-reversable hashes of a public key.  The full PublicKey is preferred.
 */
declare class Address {
    addy: Buffer;
    constructor(addy: Buffer);
    static fromBuffer(buffer: Buffer): Address;
    static fromString(string: string, address_prefix?: string): Address;
    /** @return Address - Compressed PTS format (by default) */
    static fromPublic(public_key: PublicKey, compressed?: boolean, version?: number): Address;
    toBuffer(): Buffer;
    toString(address_prefix?: string): string;
}
export default Address;
