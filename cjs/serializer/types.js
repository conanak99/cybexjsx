"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Low-level types that make up operations
/* tslint:disable */
const SerializerValidation_1 = __importDefault(require("./SerializerValidation"));
const FastParser_1 = __importDefault(require("./FastParser"));
const ChainTypes_1 = require("../chain/ChainTypes");
const ObjectId_1 = __importDefault(require("../chain/ObjectId"));
const ecc_1 = require("../ecc");
const HEX_DUMP = process.env.npm_config__graphene_serializer_hex_dump;
const uint8 = {
    fromByteBuffer(b) {
        return b.readUint8();
    },
    appendByteBuffer(b, object) {
        SerializerValidation_1.default.require_range(0, 0xff, object, `uint8 ${object}`);
        b.writeUint8(object);
        return;
    },
    fromObject(object) {
        SerializerValidation_1.default.require_range(0, 0xff, object, `uint8 ${object}`);
        return object;
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return 0;
        }
        SerializerValidation_1.default.require_range(0, 0xff, object, `uint8 ${object}`);
        return parseInt(object);
    }
};
const uint16 = {
    fromByteBuffer(b) {
        return b.readUint16();
    },
    appendByteBuffer(b, object) {
        SerializerValidation_1.default.require_range(0, 0xffff, object, `uint16 ${object}`);
        b.writeUint16(object);
        return;
    },
    fromObject(object) {
        SerializerValidation_1.default.require_range(0, 0xffff, object, `uint16 ${object}`);
        return object;
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return 0;
        }
        SerializerValidation_1.default.require_range(0, 0xffff, object, `uint16 ${object}`);
        return parseInt(object);
    }
};
const uint32 = {
    fromByteBuffer(b) {
        return b.readUint32();
    },
    appendByteBuffer(b, object) {
        SerializerValidation_1.default.require_range(0, 0xffffffff, object, `uint32 ${object}`);
        b.writeUint32(object);
        return;
    },
    fromObject(object) {
        SerializerValidation_1.default.require_range(0, 0xffffffff, object, `uint32 ${object}`);
        return object;
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return 0;
        }
        SerializerValidation_1.default.require_range(0, 0xffffffff, object, `uint32 ${object}`);
        return parseInt(object);
    }
};
var MIN_SIGNED_32 = -1 * Math.pow(2, 31);
var MAX_SIGNED_32 = Math.pow(2, 31) - 1;
const varint32 = {
    fromByteBuffer(b) {
        return b.readVarint32();
    },
    appendByteBuffer(b, object) {
        SerializerValidation_1.default.require_range(MIN_SIGNED_32, MAX_SIGNED_32, object, `uint32 ${object}`);
        b.writeVarint32(object);
        return;
    },
    fromObject(object) {
        SerializerValidation_1.default.require_range(MIN_SIGNED_32, MAX_SIGNED_32, object, `uint32 ${object}`);
        return object;
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return 0;
        }
        SerializerValidation_1.default.require_range(MIN_SIGNED_32, MAX_SIGNED_32, object, `uint32 ${object}`);
        return parseInt(object);
    }
};
const int64 = {
    fromByteBuffer(b) {
        return b.readInt64();
    },
    appendByteBuffer(b, object) {
        SerializerValidation_1.default.required(object);
        b.writeInt64(SerializerValidation_1.default.to_long(object));
        return;
    },
    fromObject(object) {
        SerializerValidation_1.default.required(object);
        return SerializerValidation_1.default.to_long(object);
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return "0";
        }
        SerializerValidation_1.default.required(object);
        return SerializerValidation_1.default.to_long(object).toString();
    }
};
const uint64 = {
    fromByteBuffer(b) {
        return b.readUint64();
    },
    appendByteBuffer(b, object) {
        b.writeUint64(SerializerValidation_1.default.to_long(SerializerValidation_1.default.unsigned(object)));
        return;
    },
    fromObject(object) {
        return SerializerValidation_1.default.to_long(SerializerValidation_1.default.unsigned(object));
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return "0";
        }
        return SerializerValidation_1.default.to_long(object).toString();
    }
};
const string = {
    fromByteBuffer(b) {
        var b_copy;
        var len = b.readVarint32();
        (b_copy = b.copy(b.offset, b.offset + len)), b.skip(len);
        return Buffer.from(b_copy.toBinary(), "binary");
    },
    appendByteBuffer(b, object) {
        SerializerValidation_1.default.required(object);
        b.writeVarint32(object.length);
        b.append(object.toString("binary"), "binary");
        return;
    },
    fromObject(object) {
        SerializerValidation_1.default.required(object);
        return Buffer.from(object);
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return "";
        }
        return object.toString();
    }
};
const bytes = function (size) {
    return {
        fromByteBuffer(b) {
            if (size === undefined) {
                var b_copy;
                var len = b.readVarint32();
                (b_copy = b.copy(b.offset, b.offset + len)), b.skip(len);
                return Buffer.from(b_copy.toBinary(), "binary");
            }
            else {
                (b_copy = b.copy(b.offset, b.offset + size)), b.skip(size);
                return Buffer.from(b_copy.toBinary(), "binary");
            }
        },
        appendByteBuffer(b, object) {
            SerializerValidation_1.default.required(object);
            if (typeof object === "string") {
                object = Buffer.from(object, "hex");
            }
            if (size === undefined) {
                b.writeVarint32(object.length);
            }
            b.append(object.toString("binary"), "binary");
            return;
        },
        fromObject(object) {
            SerializerValidation_1.default.required(object);
            if (Buffer.isBuffer(object)) {
                return object;
            }
            return Buffer.from(object, "hex");
        },
        toObject(object, debug = {}) {
            if (debug.use_default && object === undefined) {
                var zeros = function (num) {
                    return new Array(num).join("00");
                };
                return zeros(size);
            }
            SerializerValidation_1.default.required(object);
            return object.toString("hex");
        }
    };
};
const bool = {
    fromByteBuffer(b) {
        return b.readUint8() === 1;
    },
    appendByteBuffer(b, object) {
        // supports boolean or integer
        b.writeUint8(JSON.parse(object) ? 1 : 0);
        return;
    },
    fromObject(object) {
        return JSON.parse(object) ? true : false;
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return false;
        }
        return JSON.parse(object) ? true : false;
    }
};
const voidType = {
    fromByteBuffer(b) {
        throw new Error("(void) undefined type");
    },
    appendByteBuffer(b, object) {
        throw new Error("(void) undefined type");
    },
    fromObject(object) {
        throw new Error("(void) undefined type");
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return undefined;
        }
        throw new Error("(void) undefined type");
    }
};
const array = function (st_operation) {
    return {
        fromByteBuffer(b) {
            var size = b.readVarint32();
            if (HEX_DUMP) {
                console.log("varint32 size = " + size.toString(16));
            }
            var result = [];
            for (var i = 0; 0 < size ? i < size : i > size; 0 < size ? i++ : i++) {
                result.push(st_operation.fromByteBuffer(b));
            }
            return sortOperation(result, st_operation);
        },
        appendByteBuffer(b, object) {
            SerializerValidation_1.default.required(object);
            object = sortOperation(object, st_operation);
            b.writeVarint32(object.length);
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                st_operation.appendByteBuffer(b, o);
            }
        },
        fromObject(object) {
            SerializerValidation_1.default.required(object);
            object = sortOperation(object, st_operation);
            var result = [];
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                result.push(st_operation.fromObject(o));
            }
            return result;
        },
        toObject(object, debug = {}) {
            if (debug.use_default && object === undefined) {
                return [st_operation.toObject(object, debug)];
            }
            SerializerValidation_1.default.required(object);
            object = sortOperation(object, st_operation);
            var result = [];
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                result.push(st_operation.toObject(o, debug));
            }
            return result;
        }
    };
};
const time_point_sec = {
    fromByteBuffer(b) {
        return b.readUint32();
    },
    appendByteBuffer(b, object) {
        if (typeof object !== "number") {
            object = time_point_sec.fromObject(object);
        }
        b.writeUint32(object);
        return;
    },
    fromObject(object) {
        SerializerValidation_1.default.required(object);
        if (typeof object === "number") {
            return object;
        }
        if (object.getTime) {
            return Math.floor(object.getTime() / 1000);
        }
        if (typeof object !== "string") {
            throw new Error("Unknown date type: " + object);
        }
        // if(typeof object === "string" && !/Z$/.test(object))
        //     object = object + "Z"
        return Math.floor(new Date(object).getTime() / 1000);
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return new Date(0).toISOString().split(".")[0];
        }
        SerializerValidation_1.default.required(object);
        if (typeof object === "string") {
            return object;
        }
        if (object.getTime) {
            return object.toISOString().split(".")[0];
        }
        var int = parseInt(object);
        SerializerValidation_1.default.require_range(0, 0xffffffff, int, `uint32 ${object}`);
        return new Date(int * 1000).toISOString().split(".")[0];
    }
};
const set = function (st_operation) {
    return {
        validate(array) {
            var dup_map = {};
            for (var i = 0, o; i < array.length; i++) {
                o = array[i];
                var ref;
                if (((ref = typeof o), ["string", "number"].indexOf(ref) >= 0)) {
                    if (dup_map[o] !== undefined) {
                        throw new Error("duplicate (set)");
                    }
                    dup_map[o] = true;
                }
            }
            return sortOperation(array, st_operation);
        },
        fromByteBuffer(b) {
            var size = b.readVarint32();
            if (HEX_DUMP) {
                console.log("varint32 size = " + size.toString(16));
            }
            return this.validate((() => {
                var result = [];
                for (var i = 0; 0 < size ? i < size : i > size; 0 < size ? i++ : i++) {
                    result.push(st_operation.fromByteBuffer(b));
                }
                return result;
            })());
        },
        appendByteBuffer(b, object) {
            if (!object) {
                object = [];
            }
            b.writeVarint32(object.length);
            var iterable = this.validate(object);
            for (var i = 0, o; i < iterable.length; i++) {
                o = iterable[i];
                st_operation.appendByteBuffer(b, o);
            }
            return;
        },
        fromObject(object) {
            if (!object) {
                object = [];
            }
            return this.validate((() => {
                var result = [];
                for (var i = 0, o; i < object.length; i++) {
                    o = object[i];
                    result.push(st_operation.fromObject(o));
                }
                return result;
            })());
        },
        toObject(object, debug = {}) {
            if (debug.use_default && object === undefined) {
                return [st_operation.toObject(object, debug)];
            }
            if (!object) {
                object = [];
            }
            return this.validate((() => {
                var result = [];
                for (var i = 0, o; i < object.length; i++) {
                    o = object[i];
                    result.push(st_operation.toObject(o, debug));
                }
                return result;
            })());
        }
    };
};
// global_parameters_update_operation current_fees
const fixed_array = function (count, st_operation) {
    return {
        fromByteBuffer(b) {
            var i, j, ref, results;
            results = [];
            for (i = j = 0, ref = count; j < ref; i = j += 1) {
                results.push(st_operation.fromByteBuffer(b));
            }
            return sortOperation(results, st_operation);
        },
        appendByteBuffer(b, object) {
            var i, j, ref;
            if (count !== 0) {
                SerializerValidation_1.default.required(object);
                object = sortOperation(object, st_operation);
            }
            for (i = j = 0, ref = count; j < ref; i = j += 1) {
                st_operation.appendByteBuffer(b, object[i]);
            }
        },
        fromObject(object) {
            var i, j, ref, results;
            if (count !== 0) {
                SerializerValidation_1.default.required(object);
            }
            results = [];
            for (i = j = 0, ref = count; j < ref; i = j += 1) {
                results.push(st_operation.fromObject(object[i]));
            }
            return results;
        },
        toObject(object, debug) {
            var i, j, k, ref, ref1, results, results1;
            if (debug == null) {
                debug = {};
            }
            if (debug.use_default && object === void 0) {
                results = [];
                for (i = j = 0, ref = count; j < ref; i = j += 1) {
                    results.push(st_operation.toObject(void 0, debug));
                }
                return results;
            }
            if (count !== 0) {
                SerializerValidation_1.default.required(object);
            }
            results1 = [];
            for (i = k = 0, ref1 = count; k < ref1; i = k += 1) {
                results1.push(st_operation.toObject(object[i], debug));
            }
            return results1;
        }
    };
};
/* Supports instance numbers (11) or object types (1.2.11).  Object type
Validation is enforced when an object type is used. */
var id_type = function (reserved_spaces, object_type) {
    SerializerValidation_1.default.required(reserved_spaces, "reserved_spaces");
    SerializerValidation_1.default.required(object_type, "object_type");
    return {
        fromByteBuffer(b) {
            return b.readVarint32();
        },
        appendByteBuffer(b, object) {
            SerializerValidation_1.default.required(object);
            if (object.resolve !== undefined) {
                object = object.resolve;
            }
            // convert 1.2.n into just n
            if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(object)) {
                object = SerializerValidation_1.default.get_instance(reserved_spaces, object_type, object);
            }
            b.writeVarint32(SerializerValidation_1.default.to_number(object));
            return;
        },
        fromObject(object) {
            SerializerValidation_1.default.required(object);
            if (object.resolve !== undefined) {
                object = object.resolve;
            }
            if (SerializerValidation_1.default.is_digits(object)) {
                return SerializerValidation_1.default.to_number(object);
            }
            return SerializerValidation_1.default.get_instance(reserved_spaces, object_type, object);
        },
        toObject(object, debug = {}) {
            var object_type_id = ChainTypes_1.ChainTypes.object_type[object_type];
            if (debug.use_default && object === undefined) {
                return `${reserved_spaces}.${object_type_id}.0`;
            }
            SerializerValidation_1.default.required(object);
            if (object.resolve !== undefined) {
                object = object.resolve;
            }
            if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(object)) {
                object = SerializerValidation_1.default.get_instance(reserved_spaces, object_type, object);
            }
            return `${reserved_spaces}.${object_type_id}.` + object;
        }
    };
};
const protocol_id_type = function (name) {
    SerializerValidation_1.default.required(name, "name");
    return id_type(ChainTypes_1.ChainTypes.reserved_spaces.protocol_ids, name);
};
const object_id_type = {
    fromByteBuffer(b) {
        return ObjectId_1.default.fromByteBuffer(b);
    },
    appendByteBuffer(b, object) {
        SerializerValidation_1.default.required(object);
        if (object.resolve !== undefined) {
            object = object.resolve;
        }
        object = ObjectId_1.default.fromString(object);
        object.appendByteBuffer(b);
        return;
    },
    fromObject(object) {
        SerializerValidation_1.default.required(object);
        if (object.resolve !== undefined) {
            object = object.resolve;
        }
        return ObjectId_1.default.fromString(object);
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return "0.0.0";
        }
        SerializerValidation_1.default.required(object);
        if (object.resolve !== undefined) {
            object = object.resolve;
        }
        object = ObjectId_1.default.fromString(object);
        return object.toString();
    }
};
const vote_id = {
    TYPE: 0x000000ff,
    ID: 0xffffff00,
    fromByteBuffer(b) {
        var value = b.readUint32();
        return {
            type: value & this.TYPE,
            id: value & this.ID
        };
    },
    appendByteBuffer(b, object) {
        SerializerValidation_1.default.required(object);
        if (object === "string") {
            object = vote_id.fromObject(object);
        }
        var value = (object.id << 8) | object.type;
        b.writeUint32(value);
        return;
    },
    fromObject(object) {
        SerializerValidation_1.default.required(object, "(type vote_id)");
        if (typeof object === "object") {
            SerializerValidation_1.default.required(object.type, "type");
            SerializerValidation_1.default.required(object.id, "id");
            return object;
        }
        SerializerValidation_1.default.require_test(/^[0-9]+:[0-9]+$/, object, `vote_id format ${object}`);
        var [type, id] = object.split(":");
        SerializerValidation_1.default.require_range(0, 0xff, type, `vote type ${object}`);
        SerializerValidation_1.default.require_range(0, 0xffffff, id, `vote id ${object}`);
        return { type, id };
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return "0:0";
        }
        SerializerValidation_1.default.required(object);
        if (typeof object === "string") {
            object = vote_id.fromObject(object);
        }
        return object.type + ":" + object.id;
    },
    compare(a, b) {
        if (typeof a !== "object") {
            a = vote_id.fromObject(a);
        }
        if (typeof b !== "object") {
            b = vote_id.fromObject(b);
        }
        return parseInt(a.id) - parseInt(b.id);
    }
};
const optional = function (st_operation) {
    SerializerValidation_1.default.required(st_operation, "st_operation");
    return {
        fromByteBuffer(b) {
            if (!(b.readUint8() === 1)) {
                return undefined;
            }
            return st_operation.fromByteBuffer(b);
        },
        appendByteBuffer(b, object) {
            if (object !== null && object !== undefined) {
                b.writeUint8(1);
                st_operation.appendByteBuffer(b, object);
            }
            else {
                b.writeUint8(0);
            }
            return;
        },
        fromObject(object) {
            if (object === undefined) {
                return undefined;
            }
            return st_operation.fromObject(object);
        },
        toObject(object, debug = {}) {
            // toObject is only null save if use_default is true
            var result_object = (() => {
                if (!debug.use_default && object === undefined) {
                    return undefined;
                }
                else {
                    return st_operation.toObject(object, debug);
                }
            })();
            if (debug.annotate) {
                if (typeof result_object === "object") {
                    result_object.__optional = "parent is optional";
                }
                else {
                    result_object = { __optional: result_object };
                }
            }
            return result_object;
        }
    };
};
const static_variant = function (_st_operations) {
    return {
        nosort: true,
        st_operations: _st_operations,
        fromByteBuffer(b) {
            var type_id = b.readVarint32();
            var st_operation = this.st_operations[type_id];
            if (HEX_DUMP) {
                console.error(`static_variant id 0x${type_id.toString(16)} (${type_id})`);
            }
            SerializerValidation_1.default.required(st_operation, `operation ${type_id}`);
            return [type_id, st_operation.fromByteBuffer(b)];
        },
        appendByteBuffer(b, object) {
            SerializerValidation_1.default.required(object);
            var type_id = object[0];
            var st_operation = this.st_operations[type_id];
            SerializerValidation_1.default.required(st_operation, `operation ${type_id}`);
            b.writeVarint32(type_id);
            st_operation.appendByteBuffer(b, object[1]);
            return;
        },
        fromObject(object) {
            SerializerValidation_1.default.required(object);
            var type_id = object[0];
            var st_operation = this.st_operations[type_id];
            SerializerValidation_1.default.required(st_operation, `operation ${type_id}`);
            return [type_id, st_operation.fromObject(object[1])];
        },
        toObject(object, debug = {}) {
            if (debug.use_default && object === undefined) {
                return [0, this.st_operations[0].toObject(undefined, debug)];
            }
            SerializerValidation_1.default.required(object);
            var type_id = object[0];
            var st_operation = this.st_operations[type_id];
            SerializerValidation_1.default.required(st_operation, `operation ${type_id}`);
            return [type_id, st_operation.toObject(object[1], debug)];
        }
    };
};
const map = function (key_st_operation, value_st_operation) {
    return {
        validate(array) {
            if (!Array.isArray(array)) {
                throw new Error("expecting array");
            }
            var dup_map = {};
            for (var i = 0, o; i < array.length; i++) {
                o = array[i];
                var ref;
                if (!(o.length === 2)) {
                    throw new Error("expecting two elements");
                }
                if (((ref = typeof o[0]), ["number", "string"].indexOf(ref) >= 0)) {
                    if (dup_map[o[0]] !== undefined) {
                        throw new Error("duplicate (map)");
                    }
                    dup_map[o[0]] = true;
                }
            }
            return sortOperation(array, key_st_operation);
        },
        fromByteBuffer(b) {
            var result = [];
            var end = b.readVarint32();
            for (var i = 0; 0 < end ? i < end : i > end; 0 < end ? i++ : i++) {
                result.push([
                    key_st_operation.fromByteBuffer(b),
                    value_st_operation.fromByteBuffer(b)
                ]);
            }
            return this.validate(result);
        },
        appendByteBuffer(b, object) {
            this.validate(object);
            b.writeVarint32(object.length);
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                key_st_operation.appendByteBuffer(b, o[0]);
                value_st_operation.appendByteBuffer(b, o[1]);
            }
            return;
        },
        fromObject(object) {
            SerializerValidation_1.default.required(object);
            var result = [];
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                result.push([
                    key_st_operation.fromObject(o[0]),
                    value_st_operation.fromObject(o[1])
                ]);
            }
            return this.validate(result);
        },
        toObject(object, debug = {}) {
            if (debug.use_default && object === undefined) {
                return [
                    [
                        key_st_operation.toObject(undefined, debug),
                        value_st_operation.toObject(undefined, debug)
                    ]
                ];
            }
            SerializerValidation_1.default.required(object);
            object = this.validate(object);
            var result = [];
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                result.push([
                    key_st_operation.toObject(o[0], debug),
                    value_st_operation.toObject(o[1], debug)
                ]);
            }
            return result;
        }
    };
};
const public_key = {
    toPublic(object) {
        if (object.resolve !== undefined) {
            object = object.resolve;
        }
        return object == null
            ? object
            : object.Q
                ? object
                : ecc_1.PublicKey.fromStringOrThrow(object);
    },
    fromByteBuffer(b) {
        return FastParser_1.default.public_key(b);
    },
    appendByteBuffer(b, object) {
        SerializerValidation_1.default.required(object);
        FastParser_1.default.public_key(b, public_key.toPublic(object));
        return;
    },
    fromObject(object) {
        SerializerValidation_1.default.required(object);
        if (object.Q) {
            return object;
        }
        return public_key.toPublic(object);
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return "CYB" + "859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM";
        }
        SerializerValidation_1.default.required(object);
        return object.toString();
    },
    compare(a, b) {
        return strCmp(a.toBlockchainAddress().toString("hex"), b.toBlockchainAddress().toString("hex"));
    }
};
const address = {
    _to_address(object) {
        SerializerValidation_1.default.required(object);
        if (object.addy) {
            return object;
        }
        return ecc_1.Address.fromString(object);
    },
    fromByteBuffer(b) {
        return new ecc_1.Address(FastParser_1.default.ripemd160(b));
    },
    appendByteBuffer(b, object) {
        FastParser_1.default.ripemd160(b, address._to_address(object).toBuffer());
        return;
    },
    fromObject(object) {
        return address._to_address(object);
    },
    toObject(object, debug = {}) {
        if (debug.use_default && object === undefined) {
            return "CYB" + "664KmHxSuQyDsfwo4WEJvWpzg1QKdg67S";
        }
        return address._to_address(object).toString();
    },
    compare(a, b) {
        return strCmp(a.toString(), b.toString());
    }
};
exports.Types = {
    address,
    public_key,
    map,
    static_variant,
    optional,
    vote_id,
    void: voidType,
    object_id_type,
    protocol_id_type,
    id_type,
    fixed_array,
    array,
    vector: array,
    bool,
    bytes,
    int64,
    share_type: int64,
    set,
    string,
    time_point_sec,
    uint8,
    uint16,
    uint32,
    uint64,
    varint32
};
let strCmp = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
let firstEl = el => (Array.isArray(el) ? el[0] : el);
let sortOperation = (array, st_operation) => {
    // console.debug("Sort OP");
    return st_operation.nosort
        ? array
        : st_operation.compare
            ? array.sort((a, b) => st_operation.compare(firstEl(a), firstEl(b))) // custom compare operation
            : array.sort((a, b) => {
                // console.debug("Sort: ", a, b);
                return typeof firstEl(a) === "number" && typeof firstEl(b) === "number"
                    ? firstEl(a) - firstEl(b)
                    : // A binary string compare does not work. Performanance is very good so HEX is used..  localeCompare is another option.
                        Buffer.isBuffer(firstEl(a)) && Buffer.isBuffer(firstEl(b))
                            ? strCmp(firstEl(a).toString("hex"), firstEl(b).toString("hex"))
                            : strCmp(firstEl(a).toString(), firstEl(b).toString());
            });
};
exports.default = exports.Types;
