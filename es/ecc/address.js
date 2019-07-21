import assert from "assert";
import { sha256, sha512, ripemd160 } from "./hash";
import { encode, decode } from "bs58";
import deepEqual from "deep-equal";
/**
 * Addresses are shortened non-reversable hashes of a public key.  The full PublicKey is preferred.
 */
var Address = /** @class */ (function () {
    function Address(addy) {
        this.addy = addy;
    }
    Address.fromBuffer = function (buffer) {
        var _hash = sha512(buffer);
        var addy = ripemd160(_hash);
        return new Address(addy);
    };
    Address.fromString = function (string, address_prefix) {
        if (address_prefix === void 0) { address_prefix = "CYB"; }
        var prefix = string.slice(0, address_prefix.length);
        assert.strictEqual(address_prefix, prefix, "Expecting key to begin with " + address_prefix + ", instead got " + prefix);
        var addy = Buffer.from(decode(string.slice(address_prefix.length)).toString("binary"), "binary");
        var checksum = addy.slice(-4);
        addy = addy.slice(0, -4);
        var new_checksum = ripemd160(addy);
        new_checksum = new_checksum.slice(0, 4);
        var isEqual = deepEqual(checksum, new_checksum); // 'Invalid checksum'
        if (!isEqual) {
            throw new Error("Checksum did not match");
        }
        return new Address(addy);
    };
    /** @return Address - Compressed PTS format (by default) */
    Address.fromPublic = function (public_key, compressed, version) {
        if (compressed === void 0) { compressed = true; }
        if (version === void 0) { version = 56; }
        var sha2 = sha256(public_key.toBuffer(compressed));
        var rep = ripemd160(sha2);
        var versionBuffer = Buffer.of(1);
        versionBuffer.writeUInt8(0xff & version, 0);
        var addr = Buffer.concat([versionBuffer, rep]);
        var check = sha256(sha256(addr));
        var buffer = Buffer.concat([addr, Buffer.from(check.slice(0, 4))]);
        return new Address(ripemd160(buffer));
    };
    Address.prototype.toBuffer = function () {
        return this.addy;
    };
    Address.prototype.toString = function (address_prefix) {
        if (address_prefix === void 0) { address_prefix = "CYB"; }
        var checksum = ripemd160(this.addy);
        var addy = Buffer.concat([Buffer.from(this.addy), checksum.slice(0, 4)]);
        return address_prefix + encode(addy);
    };
    return Address;
}());
export default Address;
