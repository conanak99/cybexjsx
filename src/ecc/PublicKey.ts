import BigInteger from "bigi";
import { getCurveByName, Point } from "ecurve";
const secp256k1 = getCurveByName("secp256k1");
import assert from "assert";
import { decode, encode } from "bs58";
import deepEqual from "deep-equal";
import ByteBuffer from "bytebuffer";

import { ripemd160, sha256, sha512 } from "./hash";

const { G, n } = secp256k1;

class PublicKey {
  Q: Point;
  /** @param {Point} public key */
  constructor(Q: Point) {
    this.Q = Q;
  }

  static fromBinary(bin: string) {
    return PublicKey.fromBuffer(Buffer.from(bin, "binary"));
  }

  static fromBuffer(buffer: Buffer) {
    if (
      buffer.toString("hex") ===
      "000000000000000000000000000000000000000000000000000000000000000000"
    ) {
      return new PublicKey(null);
    }
    return new PublicKey(Point.decodeFrom(secp256k1, buffer));
  }

  static fromPoint(point) {
    return new PublicKey(point);
  }

  /**
   *  @arg {string} public_key - like GPHXyz...
   *  @arg {string} address_prefix - like GPH
   *  @return PublicKey or `null` (if the public_key string is invalid)
   */
  static fromPublicKeyString(
    public_key: string,
    address_prefix: string = "CYB"
  ) {
    try {
      return PublicKey.fromStringOrThrow(public_key, address_prefix);
    } catch (e) {
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
  static fromStringOrThrow(public_key: string, address_prefix: string = "CYB") {
    var prefix = public_key.slice(0, address_prefix.length);
    assert.strictEqual(
      address_prefix,
      prefix,
      `Expecting key to begin with ${address_prefix}, instead got ${prefix}`
    );
    let public_key_buf = Buffer.from(
      decode(public_key.slice(address_prefix.length)).toString("binary"),
      "binary"
    );
    let checksum = public_key_buf.slice(-4);
    public_key_buf = public_key_buf.slice(0, -4);
    let new_checksum = ripemd160(public_key_buf);
    new_checksum = new_checksum.slice(0, 4);
    var isEqual = deepEqual(checksum, new_checksum); // , 'Invalid checksum'
    if (!isEqual) {
      throw new Error("Checksum did not match");
    }
    return PublicKey.fromBuffer(public_key_buf);
  }

  static fromHex(hex: string) {
    return PublicKey.fromBuffer(Buffer.from(hex, "hex"));
  }

  static fromPublicKeyStringHex(hex: string) {
    return PublicKey.fromBuffer(Buffer.from(hex, "hex"));
  }

  toBuffer(compressed = this.Q ? this.Q["compressed"] : null) {
    if (this.Q === null) {
      return Buffer.from(
        "000000000000000000000000000000000000000000000000000000000000000000",
        "hex"
      );
    }
    return this.Q.getEncoded(compressed);
  }

  toUncompressed() {
    var buf = this.Q.getEncoded(false);
    var point = Point.decodeFrom(secp256k1, buf);
    return PublicKey.fromPoint(point);
  }

  /** cyb::blockchain::address (unique but not a full public key) */
  toBlockchainAddress() {
    var pub_buf = this.toBuffer();
    var pub_sha = sha512(pub_buf);
    return ripemd160(pub_sha);
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
    var checksum = ripemd160(pub_buf);
    var addy = Buffer.concat([pub_buf, checksum.slice(0, 4)]);
    return address_prefix + encode(addy);
  }

  toAddressString(address_prefix = "CYB") {
    var pub_buf = this.toBuffer();
    var pub_sha = sha512(pub_buf);
    var addy = ripemd160(pub_sha);
    var checksum = ripemd160(addy);
    addy = Buffer.concat([addy, checksum.slice(0, 4)]);

    return address_prefix + encode(addy);
  }

  toPtsAddy() {
    var pub_buf = this.toBuffer();
    var pub_sha = sha256(pub_buf);
    var addy = ripemd160(pub_sha);
    addy = Buffer.concat([Buffer.from([0x38]), addy]); // version 56(decimal)

    const checksum = sha256(sha256(addy)) as Buffer;

    addy = Buffer.concat([addy, checksum.slice(0, 4)]);
    return encode(addy);
  }

  child(offset) {
    assert(Buffer.isBuffer(offset), "Buffer required: offset");
    assert.strictEqual(offset.length, 32, "offset length");

    offset = Buffer.concat([this.toBuffer(), offset]);
    offset = sha256(offset);

    let c = BigInteger.fromBuffer(offset);

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

  /* </HEX> */
}

export default PublicKey;
