"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const hash_1 = require("./hash");
const bs58_1 = require("bs58");
const deep_equal_1 = __importDefault(require("deep-equal"));
/**
 * Addresses are shortened non-reversable hashes of a public key.  The full PublicKey is preferred.
 */
class Address {
    constructor(addy) {
        this.addy = addy;
    }
    static fromBuffer(buffer) {
        var _hash = hash_1.sha512(buffer);
        var addy = hash_1.ripemd160(_hash);
        return new Address(addy);
    }
    static fromString(string, address_prefix = "CYB") {
        const prefix = string.slice(0, address_prefix.length);
        assert_1.default.strictEqual(address_prefix, prefix, `Expecting key to begin with ${address_prefix}, instead got ${prefix}`);
        let addy = Buffer.from(bs58_1.decode(string.slice(address_prefix.length)).toString("binary"), "binary");
        let checksum = addy.slice(-4);
        addy = addy.slice(0, -4);
        let new_checksum = hash_1.ripemd160(addy);
        new_checksum = new_checksum.slice(0, 4);
        let isEqual = deep_equal_1.default(checksum, new_checksum); // 'Invalid checksum'
        if (!isEqual) {
            throw new Error("Checksum did not match");
        }
        return new Address(addy);
    }
    /** @return Address - Compressed PTS format (by default) */
    static fromPublic(public_key, compressed = true, version = 56) {
        const sha2 = hash_1.sha256(public_key.toBuffer(compressed));
        const rep = hash_1.ripemd160(sha2);
        const versionBuffer = Buffer.of(1);
        versionBuffer.writeUInt8(0xff & version, 0);
        const addr = Buffer.concat([versionBuffer, rep]);
        const check = hash_1.sha256(hash_1.sha256(addr));
        const buffer = Buffer.concat([addr, Buffer.from(check.slice(0, 4))]);
        return new Address(hash_1.ripemd160(buffer));
    }
    toBuffer() {
        return this.addy;
    }
    toString(address_prefix = "CYB") {
        const checksum = hash_1.ripemd160(this.addy);
        const addy = Buffer.concat([Buffer.from(this.addy), checksum.slice(0, 4)]);
        return address_prefix + bs58_1.encode(addy);
    }
}
exports.default = Address;
