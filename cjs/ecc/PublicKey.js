"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bigi_1 = __importDefault(require("bigi"));
const ecurve_1 = require("ecurve");
const secp256k1 = ecurve_1.getCurveByName("secp256k1");
const assert_1 = __importDefault(require("assert"));
const bs58_1 = require("bs58");
const deep_equal_1 = __importDefault(require("deep-equal"));
const hash_1 = require("./hash");
const { G, n } = secp256k1;
class PublicKey {
    /** @param {Point} public key */
    constructor(Q) {
        this.Q = Q;
    }
    static fromBinary(bin) {
        return PublicKey.fromBuffer(Buffer.from(bin, "binary"));
    }
    static fromBuffer(buffer) {
        if (buffer.toString("hex") ===
            "000000000000000000000000000000000000000000000000000000000000000000") {
            return new PublicKey(null);
        }
        return new PublicKey(ecurve_1.Point.decodeFrom(secp256k1, buffer));
    }
    static fromPoint(point) {
        return new PublicKey(point);
    }
    /**
     *  @arg {string} public_key - like GPHXyz...
     *  @arg {string} address_prefix - like GPH
     *  @return PublicKey or `null` (if the public_key string is invalid)
     */
    static fromPublicKeyString(public_key, address_prefix = "CYB") {
        try {
            return PublicKey.fromStringOrThrow(public_key, address_prefix);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    /**
     *   @arg {string} public_key - like GPHXyz...
     *   @arg {string} address_prefix - like GPH
     *   @throws {Error} if public key is invalid
     *   @return PublicKey
     */
    static fromStringOrThrow(public_key, address_prefix = "CYB") {
        var prefix = public_key.slice(0, address_prefix.length);
        assert_1.default.strictEqual(address_prefix, prefix, `Expecting key to begin with ${address_prefix}, instead got ${prefix}`);
        let public_key_buf = Buffer.from(bs58_1.decode(public_key.slice(address_prefix.length)).toString("binary"), "binary");
        let checksum = public_key_buf.slice(-4);
        public_key_buf = public_key_buf.slice(0, -4);
        let new_checksum = hash_1.ripemd160(public_key_buf);
        new_checksum = new_checksum.slice(0, 4);
        var isEqual = deep_equal_1.default(checksum, new_checksum); // , 'Invalid checksum'
        if (!isEqual) {
            throw new Error("Checksum did not match");
        }
        return PublicKey.fromBuffer(public_key_buf);
    }
    static fromHex(hex) {
        return PublicKey.fromBuffer(Buffer.from(hex, "hex"));
    }
    static fromPublicKeyStringHex(hex) {
        return PublicKey.fromBuffer(Buffer.from(hex, "hex"));
    }
    toBuffer(compressed = this.Q ? this.Q["compressed"] : null) {
        if (this.Q === null) {
            return Buffer.from("000000000000000000000000000000000000000000000000000000000000000000", "hex");
        }
        return this.Q.getEncoded(compressed);
    }
    toUncompressed() {
        var buf = this.Q.getEncoded(false);
        var point = ecurve_1.Point.decodeFrom(secp256k1, buf);
        return PublicKey.fromPoint(point);
    }
    /** cyb::blockchain::address (unique but not a full public key) */
    toBlockchainAddress() {
        var pub_buf = this.toBuffer();
        var pub_sha = hash_1.sha512(pub_buf);
        return hash_1.ripemd160(pub_sha);
    }
    /** Alias for {@link toPublicKeyString} */
    toString(address_prefix = "CYB") {
        return this.toPublicKeyString(address_prefix);
    }
    /**
     *     Full public key
     *    {return} string
     */
    toPublicKeyString(address_prefix = "CYB") {
        var pub_buf = this.toBuffer();
        var checksum = hash_1.ripemd160(pub_buf);
        var addy = Buffer.concat([pub_buf, checksum.slice(0, 4)]);
        return address_prefix + bs58_1.encode(addy);
    }
    toAddressString(address_prefix = "CYB") {
        var pub_buf = this.toBuffer();
        var pub_sha = hash_1.sha512(pub_buf);
        var addy = hash_1.ripemd160(pub_sha);
        var checksum = hash_1.ripemd160(addy);
        addy = Buffer.concat([addy, checksum.slice(0, 4)]);
        return address_prefix + bs58_1.encode(addy);
    }
    toPtsAddy() {
        var pub_buf = this.toBuffer();
        var pub_sha = hash_1.sha256(pub_buf);
        var addy = hash_1.ripemd160(pub_sha);
        addy = Buffer.concat([Buffer.from([0x38]), addy]); // version 56(decimal)
        const checksum = hash_1.sha256(hash_1.sha256(addy));
        addy = Buffer.concat([addy, checksum.slice(0, 4)]);
        return bs58_1.encode(addy);
    }
    child(offset) {
        assert_1.default(Buffer.isBuffer(offset), "Buffer required: offset");
        assert_1.default.strictEqual(offset.length, 32, "offset length");
        offset = Buffer.concat([this.toBuffer(), offset]);
        offset = hash_1.sha256(offset);
        let c = bigi_1.default.fromBuffer(offset);
        if (c.compareTo(n) >= 0) {
            throw new Error("Child offset went out of bounds, try again");
        }
        let cG = G.multiply(c);
        let Qprime = this.Q.add(cG);
        if (secp256k1.isInfinity(Qprime)) {
            throw new Error("Child offset derived to an invalid key, try again");
        }
        return PublicKey.fromPoint(Qprime);
    }
    /* <HEX> */
    toHex() {
        return this.toBuffer().toString("hex");
    }
}
exports.default = PublicKey;
