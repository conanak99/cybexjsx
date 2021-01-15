"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
const assert_1 = __importDefault(require("assert")); // from https://github.com/bitcoinjs/bitcoinjs-lib
const enforce_types_1 = __importDefault(require("./enforce_types"));
const bigi_1 = __importDefault(require("bigi"));
function ECSignature(r, s) {
    enforce_types_1.default(bigi_1.default, r);
    enforce_types_1.default(bigi_1.default, s);
    this.r = r;
    this.s = s;
}
// Import operations
ECSignature.parseCompact = function (buffer) {
    assert_1.default.equal(buffer.length, 65, "Invalid signature length");
    var i = buffer.readUInt8(0) - 27;
    // At most 3 bits
    assert_1.default.equal(i, i & 7, "Invalid signature parameter");
    var compressed = !!(i & 4);
    // Recovery param only
    i = i & 3;
    var r = bigi_1.default.fromBuffer(buffer.slice(1, 33));
    var s = bigi_1.default.fromBuffer(buffer.slice(33));
    return {
        compressed: compressed,
        i: i,
        signature: new ECSignature(r, s)
    };
};
ECSignature.fromDER = function (buffer) {
    assert_1.default.equal(buffer.readUInt8(0), 0x30, "Not a DER sequence");
    assert_1.default.equal(buffer.readUInt8(1), buffer.length - 2, "Invalid sequence length");
    assert_1.default.equal(buffer.readUInt8(2), 0x02, "Expected a DER integer");
    var rLen = buffer.readUInt8(3);
    assert_1.default(rLen > 0, "R length is zero");
    var offset = 4 + rLen;
    assert_1.default.equal(buffer.readUInt8(offset), 0x02, "Expected a DER integer (2)");
    var sLen = buffer.readUInt8(offset + 1);
    assert_1.default(sLen > 0, "S length is zero");
    var rB = buffer.slice(4, offset);
    var sB = buffer.slice(offset + 2);
    offset += 2 + sLen;
    if (rLen > 1 && rB.readUInt8(0) === 0x00) {
        assert_1.default(rB.readUInt8(1) & 0x80, "R value excessively padded");
    }
    if (sLen > 1 && sB.readUInt8(0) === 0x00) {
        assert_1.default(sB.readUInt8(1) & 0x80, "S value excessively padded");
    }
    assert_1.default.equal(offset, buffer.length, "Invalid DER encoding");
    var r = bigi_1.default.fromDERInteger(rB);
    var s = bigi_1.default.fromDERInteger(sB);
    assert_1.default(r >= 0, "R value is negative");
    // assert(r.signum() as unknown as number >= 0, "R value is negative");
    assert_1.default(s >= 0, "S value is negative");
    // assert(s.signum() as unknown as number >= 0, "S value is negative");
    return new ECSignature(r, s);
};
// FIXME: 0x00, 0x04, 0x80 are SIGHASH_* boundary constants, importing Transaction causes a circular dependency
ECSignature.parseScriptSignature = function (buffer) {
    var hashType = buffer.readUInt8(buffer.length - 1);
    var hashTypeMod = hashType & ~0x80;
    assert_1.default(hashTypeMod > 0x00 && hashTypeMod < 0x04, "Invalid hashType");
    return {
        signature: ECSignature.fromDER(buffer.slice(0, -1)),
        hashType: hashType
    };
};
// Export operations
ECSignature.prototype.toCompact = function (i, compressed) {
    if (compressed)
        i += 4;
    i += 27;
    var buffer = Buffer.alloc(65);
    buffer.writeUInt8(i, 0);
    this.r.toBuffer(32).copy(buffer, 1);
    this.s.toBuffer(32).copy(buffer, 33);
    return buffer;
};
ECSignature.prototype.toDER = function () {
    var rBa = this.r.toDERInteger();
    var sBa = this.s.toDERInteger();
    var sequence = [];
    // INTEGER
    sequence.push(0x02, rBa.length);
    sequence = sequence.concat(rBa);
    // INTEGER
    sequence.push(0x02, sBa.length);
    sequence = sequence.concat(sBa);
    // SEQUENCE
    sequence.unshift(0x30, sequence.length);
    return Buffer.from(sequence);
};
ECSignature.prototype.toScriptSignature = function (hashType) {
    var hashTypeBuffer = Buffer.alloc(1);
    hashTypeBuffer.writeUInt8(hashType, 0);
    return Buffer.concat([this.toDER(), hashTypeBuffer]);
};
exports.default = ECSignature;
