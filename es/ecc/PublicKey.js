import BigInteger from "bigi";
import { getCurveByName, Point } from "ecurve";
var secp256k1 = getCurveByName("secp256k1");
import assert from "assert";
import { decode, encode } from "bs58";
import deepEqual from "deep-equal";
import { ripemd160, sha256, sha512 } from "./hash";
var G = secp256k1.G, n = secp256k1.n;
var PublicKey = /** @class */ (function () {
    /** @param {Point} public key */
    function PublicKey(Q) {
        this.Q = Q;
    }
    PublicKey.fromBinary = function (bin) {
        return PublicKey.fromBuffer(Buffer.from(bin, "binary"));
    };
    PublicKey.fromBuffer = function (buffer) {
        if (buffer.toString("hex") ===
            "000000000000000000000000000000000000000000000000000000000000000000") {
            return new PublicKey(null);
        }
        return new PublicKey(Point.decodeFrom(secp256k1, buffer));
    };
    PublicKey.fromPoint = function (point) {
        return new PublicKey(point);
    };
    /**
     *  @arg {string} public_key - like GPHXyz...
     *  @arg {string} address_prefix - like GPH
     *  @return PublicKey or `null` (if the public_key string is invalid)
     */
    PublicKey.fromPublicKeyString = function (public_key, address_prefix) {
        if (address_prefix === void 0) { address_prefix = "CYB"; }
        try {
            return PublicKey.fromStringOrThrow(public_key, address_prefix);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    };
    /**
     *   @arg {string} public_key - like GPHXyz...
     *   @arg {string} address_prefix - like GPH
     *   @throws {Error} if public key is invalid
     *   @return PublicKey
     */
    PublicKey.fromStringOrThrow = function (public_key, address_prefix) {
        if (address_prefix === void 0) { address_prefix = "CYB"; }
        var prefix = public_key.slice(0, address_prefix.length);
        assert.strictEqual(address_prefix, prefix, "Expecting key to begin with " + address_prefix + ", instead got " + prefix);
        var public_key_buf = Buffer.from(decode(public_key.slice(address_prefix.length)).toString("binary"), "binary");
        var checksum = public_key_buf.slice(-4);
        public_key_buf = public_key_buf.slice(0, -4);
        var new_checksum = ripemd160(public_key_buf);
        new_checksum = new_checksum.slice(0, 4);
        var isEqual = deepEqual(checksum, new_checksum); // , 'Invalid checksum'
        if (!isEqual) {
            throw new Error("Checksum did not match");
        }
        return PublicKey.fromBuffer(public_key_buf);
    };
    PublicKey.fromHex = function (hex) {
        return PublicKey.fromBuffer(Buffer.from(hex, "hex"));
    };
    PublicKey.fromPublicKeyStringHex = function (hex) {
        return PublicKey.fromBuffer(Buffer.from(hex, "hex"));
    };
    PublicKey.prototype.toBuffer = function (compressed) {
        if (compressed === void 0) { compressed = this.Q ? this.Q["compressed"] : null; }
        if (this.Q === null) {
            return Buffer.from("000000000000000000000000000000000000000000000000000000000000000000", "hex");
        }
        return this.Q.getEncoded(compressed);
    };
    PublicKey.prototype.toUncompressed = function () {
        var buf = this.Q.getEncoded(false);
        var point = Point.decodeFrom(secp256k1, buf);
        return PublicKey.fromPoint(point);
    };
    /** cyb::blockchain::address (unique but not a full public key) */
    PublicKey.prototype.toBlockchainAddress = function () {
        var pub_buf = this.toBuffer();
        var pub_sha = sha512(pub_buf);
        return ripemd160(pub_sha);
    };
    /** Alias for {@link toPublicKeyString} */
    PublicKey.prototype.toString = function (address_prefix) {
        if (address_prefix === void 0) { address_prefix = "CYB"; }
        return this.toPublicKeyString(address_prefix);
    };
    /**
     *     Full public key
     *    {return} string
     */
    PublicKey.prototype.toPublicKeyString = function (address_prefix) {
        if (address_prefix === void 0) { address_prefix = "CYB"; }
        var pub_buf = this.toBuffer();
        var checksum = ripemd160(pub_buf);
        var addy = Buffer.concat([pub_buf, checksum.slice(0, 4)]);
        return address_prefix + encode(addy);
    };
    PublicKey.prototype.toAddressString = function (address_prefix) {
        if (address_prefix === void 0) { address_prefix = "CYB"; }
        var pub_buf = this.toBuffer();
        var pub_sha = sha512(pub_buf);
        var addy = ripemd160(pub_sha);
        var checksum = ripemd160(addy);
        addy = Buffer.concat([addy, checksum.slice(0, 4)]);
        return address_prefix + encode(addy);
    };
    PublicKey.prototype.toPtsAddy = function () {
        var pub_buf = this.toBuffer();
        var pub_sha = sha256(pub_buf);
        var addy = ripemd160(pub_sha);
        addy = Buffer.concat([Buffer.from([0x38]), addy]); // version 56(decimal)
        var checksum = sha256(sha256(addy));
        addy = Buffer.concat([addy, checksum.slice(0, 4)]);
        return encode(addy);
    };
    PublicKey.prototype.child = function (offset) {
        assert(Buffer.isBuffer(offset), "Buffer required: offset");
        assert.strictEqual(offset.length, 32, "offset length");
        offset = Buffer.concat([this.toBuffer(), offset]);
        offset = sha256(offset);
        var c = BigInteger.fromBuffer(offset);
        if (c.compareTo(n) >= 0) {
            throw new Error("Child offset went out of bounds, try again");
        }
        var cG = G.multiply(c);
        var Qprime = this.Q.add(cG);
        if (secp256k1.isInfinity(Qprime)) {
            throw new Error("Child offset derived to an invalid key, try again");
        }
        return PublicKey.fromPoint(Qprime);
    };
    /* <HEX> */
    PublicKey.prototype.toHex = function () {
        return this.toBuffer().toString("hex");
    };
    return PublicKey;
}());
export default PublicKey;
