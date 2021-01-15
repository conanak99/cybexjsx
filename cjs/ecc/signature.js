"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
const ecdsa_1 = require("./ecdsa");
const hash_1 = require("./hash");
const ecurve_1 = require("ecurve");
var secp256k1 = ecurve_1.getCurveByName("secp256k1");
const assert_1 = __importDefault(require("assert"));
const bigi_1 = __importDefault(require("bigi"));
const PublicKey_1 = __importDefault(require("./PublicKey"));
class Signature {
    constructor(r1, s1, i1) {
        this.r = r1;
        this.s = s1;
        this.i = i1;
        assert_1.default.equal(this.r != null, true, "Missing parameter");
        assert_1.default.equal(this.s != null, true, "Missing parameter");
        assert_1.default.equal(this.i != null, true, "Missing parameter");
    }
    static fromBuffer(buf) {
        var i, r, s;
        assert_1.default.equal(buf.length, 65, "Invalid signature length");
        i = buf.readUInt8(0);
        assert_1.default.equal(i - 27, (i - 27) & 7, "Invalid signature parameter");
        r = bigi_1.default.fromBuffer(buf.slice(1, 33));
        s = bigi_1.default.fromBuffer(buf.slice(33));
        return new Signature(r, s, i);
    }
    /**
          @param {Buffer} buf
          @param {PrivateKey} private_key
          @return {Signature}
      */
    static signBuffer(buf, private_key) {
        var _hash = hash_1.sha256(buf, undefined);
        return Signature.signBufferSha256(_hash, private_key);
    }
    /** Sign a buffer of exactally 32 bytes in size (sha256(text))
          @param {Buffer} buf - 32 bytes binary
          @param {PrivateKey} private_key
          @return {Signature}
      */
    static signBufferSha256(buf_sha256, private_key) {
        if (buf_sha256.length !== 32 || !Buffer.isBuffer(buf_sha256))
            throw new Error("buf_sha256: 32 byte buffer requred");
        var der, e, ecsignature, i, lenR, lenS, nonce;
        i = null;
        nonce = 0;
        e = bigi_1.default.fromBuffer(buf_sha256);
        while (true) {
            ecsignature = ecdsa_1.sign(secp256k1, buf_sha256, private_key.d, nonce++);
            der = ecsignature.toDER();
            lenR = der[3];
            lenS = der[5 + lenR];
            if (lenR === 32 && lenS === 32) {
                i = ecdsa_1.calcPubKeyRecoveryParam(secp256k1, e, ecsignature, private_key.toPublicKey().Q);
                i += 4; // compressed
                i += 27; // compact  //  24 or 27 :( forcing odd-y 2nd key candidate)
                break;
            }
            if (nonce % 10 === 0) {
                console.log("WARN: " + nonce + " attempts to find canonical signature");
            }
        }
        return new Signature(ecsignature.r, ecsignature.s, i);
    }
    static sign(string, private_key) {
        return Signature.signBuffer(Buffer.from(string), private_key);
    }
    static fromHex(hex) {
        return Signature.fromBuffer(Buffer.from(hex, "hex"));
    }
    static signHex(hex, private_key) {
        var buf;
        buf = Buffer.from(hex, "hex");
        return Signature.signBuffer(buf, private_key);
    }
    toBuffer() {
        var buf;
        buf = Buffer.alloc(65);
        buf.writeUInt8(this.i, 0);
        this.r.toBuffer(32).copy(buf, 1);
        this.s.toBuffer(32).copy(buf, 33);
        return buf;
    }
    recoverPublicKeyFromBuffer(buffer) {
        return this.recoverPublicKey(hash_1.sha256(buffer, undefined));
    }
    /**
          @return {PublicKey}
      */
    recoverPublicKey(sha256_buffer) {
        let Q, e, i;
        e = bigi_1.default.fromBuffer(sha256_buffer);
        i = this.i;
        i -= 27;
        i = i & 3;
        Q = ecdsa_1.recoverPubKey(secp256k1, e, this, i);
        return PublicKey_1.default.fromPoint(Q);
    }
    /**
          @param {Buffer} un-hashed
          @param {./PublicKey}
          @return {boolean}
      */
    verifyBuffer(buf, public_key) {
        var _hash = hash_1.sha256(buf, undefined);
        return this.verifyHash(_hash, public_key);
    }
    verifyHash(hash, public_key) {
        assert_1.default.equal(hash.length, 32, "A SHA 256 should be 32 bytes long, instead got " + hash.length);
        return ecdsa_1.verify(secp256k1, hash, {
            r: this.r,
            s: this.s
        }, public_key.Q);
    }
    /* <HEX> */
    toByteBuffer() {
        var b;
        b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
        this.appendByteBuffer(b);
        return b.copy(0, b.offset);
    }
    toHex() {
        return this.toBuffer().toString("hex");
    }
    verifyHex(hex, public_key) {
        var buf;
        buf = Buffer.from(hex, "hex");
        return this.verifyBuffer(buf, public_key);
    }
}
exports.default = Signature;
