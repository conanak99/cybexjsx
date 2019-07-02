import assert from "assert";
import { sha256, sha512, ripemd160 } from "./hash";
import { encode, decode } from "bs58";
import deepEqual from "deep-equal";
import PublicKey from "./PublicKey";

/**
 * Addresses are shortened non-reversable hashes of a public key.  The full PublicKey is preferred.
 */
class Address {
  addy: Buffer;
  constructor(addy: Buffer) {
    this.addy = addy;
  }

  static fromBuffer(buffer: Buffer) {
    var _hash = sha512(buffer);
    var addy = ripemd160(_hash);
    return new Address(addy);
  }

  static fromString(string: string, address_prefix = "CYB") {
    const prefix = string.slice(0, address_prefix.length);
    assert.strictEqual(
      address_prefix,
      prefix,
      `Expecting key to begin with ${address_prefix}, instead got ${prefix}`
    );
    let addy = Buffer.from(
      decode(string.slice(address_prefix.length)).toString("binary"),
      "binary"
    );
    let checksum = addy.slice(-4);
    addy = addy.slice(0, -4);
    let new_checksum = ripemd160(addy);
    new_checksum = new_checksum.slice(0, 4);
    let isEqual = deepEqual(checksum, new_checksum); // 'Invalid checksum'
    if (!isEqual) {
      throw new Error("Checksum did not match");
    }
    return new Address(addy);
  }

  /** @return Address - Compressed PTS format (by default) */
  static fromPublic(public_key: PublicKey, compressed = true, version = 56) {
    const sha2 = sha256(public_key.toBuffer(compressed));
    const rep = ripemd160(sha2);
    const versionBuffer = Buffer.of(1);
    versionBuffer.writeUInt8(0xff & version, 0);
    const addr = Buffer.concat([versionBuffer, rep]);
    const check = sha256(sha256(addr)) as Buffer;
    const buffer = Buffer.concat([addr, Buffer.from(check.slice(0, 4))]);
    return new Address(ripemd160(buffer));
  }

  toBuffer() {
    return this.addy;
  }

  toString(address_prefix = "CYB") {
    const checksum = ripemd160(this.addy);
    const addy = Buffer.concat([Buffer.from(this.addy), checksum.slice(0, 4)]);
    return address_prefix + encode(addy);
  }
}

export default Address;
