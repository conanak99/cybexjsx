"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bytebuffer_1 = __importDefault(require("bytebuffer"));
function default_1(type) {
    return {
        fromHex(hex) {
            var b = bytebuffer_1.default.fromHex(hex, bytebuffer_1.default.LITTLE_ENDIAN);
            return type.fromByteBuffer(b);
        },
        toHex(object) {
            var b = toByteBuffer(type, object);
            return b.toHex();
        },
        fromBuffer(buffer) {
            var b = bytebuffer_1.default.fromBinary(buffer.toString(), bytebuffer_1.default.LITTLE_ENDIAN);
            return type.fromByteBuffer(b);
        },
        toBuffer(object) {
            return Buffer.from(toByteBuffer(type, object).toBinary(), "binary");
        },
        fromBinary(string) {
            var b = bytebuffer_1.default.fromBinary(string, bytebuffer_1.default.LITTLE_ENDIAN);
            return type.fromByteBuffer(b);
        },
        toBinary(object) {
            return toByteBuffer(type, object).toBinary();
        }
    };
}
exports.default = default_1;
var toByteBuffer = function (type, object) {
    var b = new bytebuffer_1.default(bytebuffer_1.default.DEFAULT_CAPACITY, bytebuffer_1.default.LITTLE_ENDIAN);
    type.appendByteBuffer(b, object);
    return b.copy(0, b.offset);
};
