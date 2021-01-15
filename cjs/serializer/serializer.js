"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bytebuffer_1 = __importDefault(require("bytebuffer"));
const error_with_cause_1 = __importDefault(require("./error_with_cause"));
const HEX_DUMP = process && process.env.npm_config__graphene_serializer_hex_dump;
class Serializer {
    constructor(operation_name, types, orderedKey) {
        this.operation_name = operation_name;
        this.types = types;
        if (this.types) {
            this.keys = orderedKey || Object.keys(this.types);
        }
        Serializer.printDebug = true;
    }
    fromByteBuffer(b) {
        var object = {};
        var field = null;
        try {
            var iterable = this.keys;
            for (var i = 0; i < iterable.length; i++) {
                field = iterable[i];
                var type = this.types[field];
                try {
                    if (HEX_DUMP) {
                        if (type.operation_name) {
                            console.error(type.operation_name);
                        }
                        else {
                            var o1 = b.offset;
                            type.fromByteBuffer(b);
                            var o2 = b.offset;
                            b.offset = o1;
                            // b.reset()
                            var _b = b.copy(o1, o2);
                            console.error(`${this.operation_name}.${field}\t`, _b.toHex());
                        }
                    }
                    object[field] = type.fromByteBuffer(b);
                }
                catch (e) {
                    if (Serializer.printDebug) {
                        console.error(`Error reading ${this.operation_name}.${field} in data:`);
                        b.printDebug();
                    }
                    throw e;
                }
            }
        }
        catch (error) {
            error_with_cause_1.default.throw(this.operation_name + "." + field, error);
        }
        return object;
    }
    appendByteBuffer(b, object) {
        var field = null;
        try {
            var iterable = this.keys;
            for (var i = 0; i < iterable.length; i++) {
                field = iterable[i];
                var type = this.types[field];
                type.appendByteBuffer(b, object[field]);
            }
        }
        catch (error) {
            try {
                error_with_cause_1.default.throw(this.operation_name +
                    "." +
                    field +
                    " = " +
                    JSON.stringify(object[field]), error);
            }
            catch (e) {
                // circular ref
                error_with_cause_1.default.throw(this.operation_name + "." + field + " = " + object[field], error);
            }
        }
        return;
    }
    fromObject(serialized_object) {
        var result = {};
        var field = null;
        try {
            var iterable = this.keys;
            for (var i = 0; i < iterable.length; i++) {
                field = iterable[i];
                var type = this.types[field];
                var value = serialized_object[field];
                // DEBUG value = value.resolve if value.resolve
                // DEBUG console.log('... value',field,value)
                var object = type.fromObject(value);
                result[field] = object;
            }
        }
        catch (error) {
            error_with_cause_1.default.throw(this.operation_name + "." + field, error);
        }
        return result;
    }
    /**
     * @arg {boolean} [debug.use_default = false] - more template friendly
     * @arg {boolean} [debug.annotate = false] - add user-friendly information
     */
    toObject(serialized_object = {}, debug = { use_default: false, annotate: false }) {
        var result = {};
        var field = null;
        try {
            if (!this.types) {
                return result;
            }
            var iterable = this.keys;
            for (var i = 0; i < iterable.length; i++) {
                field = iterable[i];
                var type = this.types[field];
                var object = type.toObject(typeof serialized_object !== "undefined" && serialized_object !== null
                    ? serialized_object[field]
                    : undefined, debug);
                result[field] = object;
                if (HEX_DUMP) {
                    var b = new bytebuffer_1.default(bytebuffer_1.default.DEFAULT_CAPACITY, bytebuffer_1.default.LITTLE_ENDIAN);
                    type.appendByteBuffer(b, typeof serialized_object !== "undefined" &&
                        serialized_object !== null
                        ? serialized_object[field]
                        : undefined);
                    b = b.copy(0, b.offset);
                    console.error(this.operation_name + "." + field, b.toHex());
                }
            }
        }
        catch (error) {
            error_with_cause_1.default.throw(this.operation_name + "." + field, error);
        }
        return result;
    }
    /** Sort by the first element in a operation */
    compare(a, b) {
        let first_key = this.keys[0];
        let first_type = this.types[first_key];
        let valA = a[first_key];
        let valB = b[first_key];
        if (first_type.compare) {
            return first_type.compare(valA, valB);
        }
        if (typeof valA === "number" && typeof valB === "number") {
            return valA - valB;
        }
        let encoding;
        if (Buffer.isBuffer(valA) && Buffer.isBuffer(valB)) {
            // A binary string compare does not work.  If localeCompare is well supported that could replace HEX.  Performanance is very good so comparing HEX works.
            encoding = "hex";
        }
        let strA = valA.toString(encoding);
        let strB = valB.toString(encoding);
        return strA > strB ? 1 : strA < strB ? -1 : 0;
    }
    // <helper_functions>
    fromHex(hex) {
        var b = bytebuffer_1.default.fromHex(hex, bytebuffer_1.default.LITTLE_ENDIAN);
        return this.fromByteBuffer(b);
    }
    fromBuffer(buffer) {
        var b = bytebuffer_1.default.fromBinary(buffer.toString("binary"), bytebuffer_1.default.LITTLE_ENDIAN);
        return this.fromByteBuffer(b);
    }
    toHex(object) {
        // return this.toBuffer(object).toString("hex")
        var b = this.toByteBuffer(object);
        return b.toHex();
    }
    toByteBuffer(object) {
        var b = new bytebuffer_1.default(bytebuffer_1.default.DEFAULT_CAPACITY, bytebuffer_1.default.LITTLE_ENDIAN);
        this.appendByteBuffer(b, object);
        return b.copy(0, b.offset);
    }
    toBuffer(object) {
        return Buffer.from(this.toByteBuffer(object).toBinary(), "binary");
    }
}
exports.Serializer = Serializer;
exports.default = Serializer;
