"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const { Long } from "require("long")";
const long_1 = __importDefault(require("long"));
const SerializerValidation_1 = __importDefault(require("../serializer/SerializerValidation"));
var DB_MAX_INSTANCE_ID = long_1.default.fromNumber(Math.pow(2, 48) - 1);
class ObjectId {
    constructor(space, type, instance) {
        this.space = space;
        this.type = type;
        this.instance = instance;
        var instance_string = this.instance.toString();
        var ObjectId = `${this.space}.${this.type}.${instance_string}`;
        if (!SerializerValidation_1.default.is_digits(instance_string)) {
            throw new Error(`Invalid object id ${ObjectId}`);
        }
    }
    static fromString(value) {
        if (value.space !== undefined &&
            value.type !== undefined &&
            value.instance !== undefined) {
            return value;
        }
        var params = SerializerValidation_1.default.require_match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/, SerializerValidation_1.default.required(value, "ObjectId"), "ObjectId");
        return new ObjectId(parseInt(params[1]), parseInt(params[2]), long_1.default.fromString(params[3]));
    }
    static fromLong(long) {
        var space = long.shiftRight(56).toInt();
        var type = long.shiftRight(48).toInt() & 0x00ff;
        var instance = long.and(DB_MAX_INSTANCE_ID);
        return new ObjectId(space, type, instance);
    }
    static fromByteBuffer(b) {
        return ObjectId.fromLong(b.readUint64());
    }
    toLong() {
        return long_1.default.fromNumber(this.space)
            .shiftLeft(56)
            .or(long_1.default.fromNumber(this.type)
            .shiftLeft(48)
            .or(this.instance));
    }
    appendByteBuffer(b) {
        return b.writeUint64(this.toLong());
    }
    toString() {
        return `${this.space}.${this.type}.${this.instance.toString()}`;
    }
}
exports.default = ObjectId;
