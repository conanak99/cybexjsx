// Low-level types that make up operations
/* tslint:disable */
import v from "./SerializerValidation";
import fp from "./FastParser";
import { ChainTypes } from "../chain/ChainTypes";
import ObjectId from "../chain/ObjectId";
import { PublicKey, Address } from "../ecc";
var HEX_DUMP = process.env.npm_config__graphene_serializer_hex_dump;
var uint8 = {
    fromByteBuffer: function (b) {
        return b.readUint8();
    },
    appendByteBuffer: function (b, object) {
        v.require_range(0, 0xff, object, "uint8 " + object);
        b.writeUint8(object);
        return;
    },
    fromObject: function (object) {
        v.require_range(0, 0xff, object, "uint8 " + object);
        return object;
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return 0;
        }
        v.require_range(0, 0xff, object, "uint8 " + object);
        return parseInt(object);
    }
};
var uint16 = {
    fromByteBuffer: function (b) {
        return b.readUint16();
    },
    appendByteBuffer: function (b, object) {
        v.require_range(0, 0xffff, object, "uint16 " + object);
        b.writeUint16(object);
        return;
    },
    fromObject: function (object) {
        v.require_range(0, 0xffff, object, "uint16 " + object);
        return object;
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return 0;
        }
        v.require_range(0, 0xffff, object, "uint16 " + object);
        return parseInt(object);
    }
};
var uint32 = {
    fromByteBuffer: function (b) {
        return b.readUint32();
    },
    appendByteBuffer: function (b, object) {
        v.require_range(0, 0xffffffff, object, "uint32 " + object);
        b.writeUint32(object);
        return;
    },
    fromObject: function (object) {
        v.require_range(0, 0xffffffff, object, "uint32 " + object);
        return object;
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return 0;
        }
        v.require_range(0, 0xffffffff, object, "uint32 " + object);
        return parseInt(object);
    }
};
var MIN_SIGNED_32 = -1 * Math.pow(2, 31);
var MAX_SIGNED_32 = Math.pow(2, 31) - 1;
var varint32 = {
    fromByteBuffer: function (b) {
        return b.readVarint32();
    },
    appendByteBuffer: function (b, object) {
        v.require_range(MIN_SIGNED_32, MAX_SIGNED_32, object, "uint32 " + object);
        b.writeVarint32(object);
        return;
    },
    fromObject: function (object) {
        v.require_range(MIN_SIGNED_32, MAX_SIGNED_32, object, "uint32 " + object);
        return object;
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return 0;
        }
        v.require_range(MIN_SIGNED_32, MAX_SIGNED_32, object, "uint32 " + object);
        return parseInt(object);
    }
};
var int64 = {
    fromByteBuffer: function (b) {
        return b.readInt64();
    },
    appendByteBuffer: function (b, object) {
        v.required(object);
        b.writeInt64(v.to_long(object));
        return;
    },
    fromObject: function (object) {
        v.required(object);
        return v.to_long(object);
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return "0";
        }
        v.required(object);
        return v.to_long(object).toString();
    }
};
var uint64 = {
    fromByteBuffer: function (b) {
        return b.readUint64();
    },
    appendByteBuffer: function (b, object) {
        b.writeUint64(v.to_long(v.unsigned(object)));
        return;
    },
    fromObject: function (object) {
        return v.to_long(v.unsigned(object));
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return "0";
        }
        return v.to_long(object).toString();
    }
};
var string = {
    fromByteBuffer: function (b) {
        var b_copy;
        var len = b.readVarint32();
        (b_copy = b.copy(b.offset, b.offset + len)), b.skip(len);
        return Buffer.from(b_copy.toBinary(), "binary");
    },
    appendByteBuffer: function (b, object) {
        v.required(object);
        b.writeVarint32(object.length);
        b.append(object.toString("binary"), "binary");
        return;
    },
    fromObject: function (object) {
        v.required(object);
        return Buffer.from(object);
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return "";
        }
        return object.toString();
    }
};
var bytes = function (size) {
    return {
        fromByteBuffer: function (b) {
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
        appendByteBuffer: function (b, object) {
            v.required(object);
            if (typeof object === "string") {
                object = Buffer.from(object, "hex");
            }
            if (size === undefined) {
                b.writeVarint32(object.length);
            }
            b.append(object.toString("binary"), "binary");
            return;
        },
        fromObject: function (object) {
            v.required(object);
            if (Buffer.isBuffer(object)) {
                return object;
            }
            return Buffer.from(object, "hex");
        },
        toObject: function (object, debug) {
            if (debug === void 0) { debug = {}; }
            if (debug.use_default && object === undefined) {
                var zeros = function (num) {
                    return new Array(num).join("00");
                };
                return zeros(size);
            }
            v.required(object);
            return object.toString("hex");
        }
    };
};
var bool = {
    fromByteBuffer: function (b) {
        return b.readUint8() === 1;
    },
    appendByteBuffer: function (b, object) {
        // supports boolean or integer
        b.writeUint8(JSON.parse(object) ? 1 : 0);
        return;
    },
    fromObject: function (object) {
        return JSON.parse(object) ? true : false;
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return false;
        }
        return JSON.parse(object) ? true : false;
    }
};
var voidType = {
    fromByteBuffer: function (b) {
        throw new Error("(void) undefined type");
    },
    appendByteBuffer: function (b, object) {
        throw new Error("(void) undefined type");
    },
    fromObject: function (object) {
        throw new Error("(void) undefined type");
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return undefined;
        }
        throw new Error("(void) undefined type");
    }
};
var array = function (st_operation) {
    return {
        fromByteBuffer: function (b) {
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
        appendByteBuffer: function (b, object) {
            v.required(object);
            object = sortOperation(object, st_operation);
            b.writeVarint32(object.length);
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                st_operation.appendByteBuffer(b, o);
            }
        },
        fromObject: function (object) {
            v.required(object);
            object = sortOperation(object, st_operation);
            var result = [];
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                result.push(st_operation.fromObject(o));
            }
            return result;
        },
        toObject: function (object, debug) {
            if (debug === void 0) { debug = {}; }
            if (debug.use_default && object === undefined) {
                return [st_operation.toObject(object, debug)];
            }
            v.required(object);
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
var time_point_sec = {
    fromByteBuffer: function (b) {
        return b.readUint32();
    },
    appendByteBuffer: function (b, object) {
        if (typeof object !== "number") {
            object = time_point_sec.fromObject(object);
        }
        b.writeUint32(object);
        return;
    },
    fromObject: function (object) {
        v.required(object);
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
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return new Date(0).toISOString().split(".")[0];
        }
        v.required(object);
        if (typeof object === "string") {
            return object;
        }
        if (object.getTime) {
            return object.toISOString().split(".")[0];
        }
        var int = parseInt(object);
        v.require_range(0, 0xffffffff, int, "uint32 " + object);
        return new Date(int * 1000).toISOString().split(".")[0];
    }
};
var set = function (st_operation) {
    return {
        validate: function (array) {
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
        fromByteBuffer: function (b) {
            var size = b.readVarint32();
            if (HEX_DUMP) {
                console.log("varint32 size = " + size.toString(16));
            }
            return this.validate((function () {
                var result = [];
                for (var i = 0; 0 < size ? i < size : i > size; 0 < size ? i++ : i++) {
                    result.push(st_operation.fromByteBuffer(b));
                }
                return result;
            })());
        },
        appendByteBuffer: function (b, object) {
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
        fromObject: function (object) {
            if (!object) {
                object = [];
            }
            return this.validate((function () {
                var result = [];
                for (var i = 0, o; i < object.length; i++) {
                    o = object[i];
                    result.push(st_operation.fromObject(o));
                }
                return result;
            })());
        },
        toObject: function (object, debug) {
            if (debug === void 0) { debug = {}; }
            if (debug.use_default && object === undefined) {
                return [st_operation.toObject(object, debug)];
            }
            if (!object) {
                object = [];
            }
            return this.validate((function () {
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
var fixed_array = function (count, st_operation) {
    return {
        fromByteBuffer: function (b) {
            var i, j, ref, results;
            results = [];
            for (i = j = 0, ref = count; j < ref; i = j += 1) {
                results.push(st_operation.fromByteBuffer(b));
            }
            return sortOperation(results, st_operation);
        },
        appendByteBuffer: function (b, object) {
            var i, j, ref;
            if (count !== 0) {
                v.required(object);
                object = sortOperation(object, st_operation);
            }
            for (i = j = 0, ref = count; j < ref; i = j += 1) {
                st_operation.appendByteBuffer(b, object[i]);
            }
        },
        fromObject: function (object) {
            var i, j, ref, results;
            if (count !== 0) {
                v.required(object);
            }
            results = [];
            for (i = j = 0, ref = count; j < ref; i = j += 1) {
                results.push(st_operation.fromObject(object[i]));
            }
            return results;
        },
        toObject: function (object, debug) {
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
                v.required(object);
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
    v.required(reserved_spaces, "reserved_spaces");
    v.required(object_type, "object_type");
    return {
        fromByteBuffer: function (b) {
            return b.readVarint32();
        },
        appendByteBuffer: function (b, object) {
            v.required(object);
            if (object.resolve !== undefined) {
                object = object.resolve;
            }
            // convert 1.2.n into just n
            if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(object)) {
                object = v.get_instance(reserved_spaces, object_type, object);
            }
            b.writeVarint32(v.to_number(object));
            return;
        },
        fromObject: function (object) {
            v.required(object);
            if (object.resolve !== undefined) {
                object = object.resolve;
            }
            if (v.is_digits(object)) {
                return v.to_number(object);
            }
            return v.get_instance(reserved_spaces, object_type, object);
        },
        toObject: function (object, debug) {
            if (debug === void 0) { debug = {}; }
            var object_type_id = ChainTypes.object_type[object_type];
            if (debug.use_default && object === undefined) {
                return reserved_spaces + "." + object_type_id + ".0";
            }
            v.required(object);
            if (object.resolve !== undefined) {
                object = object.resolve;
            }
            if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(object)) {
                object = v.get_instance(reserved_spaces, object_type, object);
            }
            return reserved_spaces + "." + object_type_id + "." + object;
        }
    };
};
var protocol_id_type = function (name) {
    v.required(name, "name");
    return id_type(ChainTypes.reserved_spaces.protocol_ids, name);
};
var object_id_type = {
    fromByteBuffer: function (b) {
        return ObjectId.fromByteBuffer(b);
    },
    appendByteBuffer: function (b, object) {
        v.required(object);
        if (object.resolve !== undefined) {
            object = object.resolve;
        }
        object = ObjectId.fromString(object);
        object.appendByteBuffer(b);
        return;
    },
    fromObject: function (object) {
        v.required(object);
        if (object.resolve !== undefined) {
            object = object.resolve;
        }
        return ObjectId.fromString(object);
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return "0.0.0";
        }
        v.required(object);
        if (object.resolve !== undefined) {
            object = object.resolve;
        }
        object = ObjectId.fromString(object);
        return object.toString();
    }
};
var vote_id = {
    TYPE: 0x000000ff,
    ID: 0xffffff00,
    fromByteBuffer: function (b) {
        var value = b.readUint32();
        return {
            type: value & this.TYPE,
            id: value & this.ID
        };
    },
    appendByteBuffer: function (b, object) {
        v.required(object);
        if (object === "string") {
            object = vote_id.fromObject(object);
        }
        var value = (object.id << 8) | object.type;
        b.writeUint32(value);
        return;
    },
    fromObject: function (object) {
        v.required(object, "(type vote_id)");
        if (typeof object === "object") {
            v.required(object.type, "type");
            v.required(object.id, "id");
            return object;
        }
        v.require_test(/^[0-9]+:[0-9]+$/, object, "vote_id format " + object);
        var _a = object.split(":"), type = _a[0], id = _a[1];
        v.require_range(0, 0xff, type, "vote type " + object);
        v.require_range(0, 0xffffff, id, "vote id " + object);
        return { type: type, id: id };
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return "0:0";
        }
        v.required(object);
        if (typeof object === "string") {
            object = vote_id.fromObject(object);
        }
        return object.type + ":" + object.id;
    },
    compare: function (a, b) {
        if (typeof a !== "object") {
            a = vote_id.fromObject(a);
        }
        if (typeof b !== "object") {
            b = vote_id.fromObject(b);
        }
        return parseInt(a.id) - parseInt(b.id);
    }
};
var optional = function (st_operation) {
    v.required(st_operation, "st_operation");
    return {
        fromByteBuffer: function (b) {
            if (!(b.readUint8() === 1)) {
                return undefined;
            }
            return st_operation.fromByteBuffer(b);
        },
        appendByteBuffer: function (b, object) {
            if (object !== null && object !== undefined) {
                b.writeUint8(1);
                st_operation.appendByteBuffer(b, object);
            }
            else {
                b.writeUint8(0);
            }
            return;
        },
        fromObject: function (object) {
            if (object === undefined) {
                return undefined;
            }
            return st_operation.fromObject(object);
        },
        toObject: function (object, debug) {
            if (debug === void 0) { debug = {}; }
            // toObject is only null save if use_default is true
            var result_object = (function () {
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
var static_variant = function (_st_operations) {
    return {
        nosort: true,
        st_operations: _st_operations,
        fromByteBuffer: function (b) {
            var type_id = b.readVarint32();
            var st_operation = this.st_operations[type_id];
            if (HEX_DUMP) {
                console.error("static_variant id 0x" + type_id.toString(16) + " (" + type_id + ")");
            }
            v.required(st_operation, "operation " + type_id);
            return [type_id, st_operation.fromByteBuffer(b)];
        },
        appendByteBuffer: function (b, object) {
            v.required(object);
            var type_id = object[0];
            var st_operation = this.st_operations[type_id];
            v.required(st_operation, "operation " + type_id);
            b.writeVarint32(type_id);
            st_operation.appendByteBuffer(b, object[1]);
            return;
        },
        fromObject: function (object) {
            v.required(object);
            var type_id = object[0];
            var st_operation = this.st_operations[type_id];
            v.required(st_operation, "operation " + type_id);
            return [type_id, st_operation.fromObject(object[1])];
        },
        toObject: function (object, debug) {
            if (debug === void 0) { debug = {}; }
            if (debug.use_default && object === undefined) {
                return [0, this.st_operations[0].toObject(undefined, debug)];
            }
            v.required(object);
            var type_id = object[0];
            var st_operation = this.st_operations[type_id];
            v.required(st_operation, "operation " + type_id);
            return [type_id, st_operation.toObject(object[1], debug)];
        }
    };
};
var map = function (key_st_operation, value_st_operation) {
    return {
        validate: function (array) {
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
        fromByteBuffer: function (b) {
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
        appendByteBuffer: function (b, object) {
            this.validate(object);
            b.writeVarint32(object.length);
            for (var i = 0, o; i < object.length; i++) {
                o = object[i];
                key_st_operation.appendByteBuffer(b, o[0]);
                value_st_operation.appendByteBuffer(b, o[1]);
            }
            return;
        },
        fromObject: function (object) {
            v.required(object);
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
        toObject: function (object, debug) {
            if (debug === void 0) { debug = {}; }
            if (debug.use_default && object === undefined) {
                return [
                    [
                        key_st_operation.toObject(undefined, debug),
                        value_st_operation.toObject(undefined, debug)
                    ]
                ];
            }
            v.required(object);
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
var public_key = {
    toPublic: function (object) {
        if (object.resolve !== undefined) {
            object = object.resolve;
        }
        return object == null
            ? object
            : object.Q
                ? object
                : PublicKey.fromStringOrThrow(object);
    },
    fromByteBuffer: function (b) {
        return fp.public_key(b);
    },
    appendByteBuffer: function (b, object) {
        v.required(object);
        fp.public_key(b, public_key.toPublic(object));
        return;
    },
    fromObject: function (object) {
        v.required(object);
        if (object.Q) {
            return object;
        }
        return public_key.toPublic(object);
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return "CYB" + "859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM";
        }
        v.required(object);
        return object.toString();
    },
    compare: function (a, b) {
        return strCmp(a.toBlockchainAddress().toString("hex"), b.toBlockchainAddress().toString("hex"));
    }
};
var address = {
    _to_address: function (object) {
        v.required(object);
        if (object.addy) {
            return object;
        }
        return Address.fromString(object);
    },
    fromByteBuffer: function (b) {
        return new Address(fp.ripemd160(b));
    },
    appendByteBuffer: function (b, object) {
        fp.ripemd160(b, address._to_address(object).toBuffer());
        return;
    },
    fromObject: function (object) {
        return address._to_address(object);
    },
    toObject: function (object, debug) {
        if (debug === void 0) { debug = {}; }
        if (debug.use_default && object === undefined) {
            return "CYB" + "664KmHxSuQyDsfwo4WEJvWpzg1QKdg67S";
        }
        return address._to_address(object).toString();
    },
    compare: function (a, b) {
        return strCmp(a.toString(), b.toString());
    }
};
export var Types = {
    address: address,
    public_key: public_key,
    map: map,
    static_variant: static_variant,
    optional: optional,
    vote_id: vote_id,
    void: voidType,
    object_id_type: object_id_type,
    protocol_id_type: protocol_id_type,
    id_type: id_type,
    fixed_array: fixed_array,
    array: array,
    vector: array,
    bool: bool,
    bytes: bytes,
    int64: int64,
    share_type: int64,
    set: set,
    string: string,
    time_point_sec: time_point_sec,
    uint8: uint8,
    uint16: uint16,
    uint32: uint32,
    uint64: uint64,
    varint32: varint32
};
var strCmp = function (a, b) { return (a > b ? 1 : a < b ? -1 : 0); };
var firstEl = function (el) { return (Array.isArray(el) ? el[0] : el); };
var sortOperation = function (array, st_operation) {
    // console.debug("Sort OP");
    return st_operation.nosort
        ? array
        : st_operation.compare
            ? array.sort(function (a, b) { return st_operation.compare(firstEl(a), firstEl(b)); }) // custom compare operation
            : array.sort(function (a, b) {
                // console.debug("Sort: ", a, b);
                return typeof firstEl(a) === "number" && typeof firstEl(b) === "number"
                    ? firstEl(a) - firstEl(b)
                    : // A binary string compare does not work. Performanance is very good so HEX is used..  localeCompare is another option.
                        Buffer.isBuffer(firstEl(a)) && Buffer.isBuffer(firstEl(b))
                            ? strCmp(firstEl(a).toString("hex"), firstEl(b).toString("hex"))
                            : strCmp(firstEl(a).toString(), firstEl(b).toString());
            });
};
export default Types;
