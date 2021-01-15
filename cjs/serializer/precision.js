"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _my;
const SerializerValidation_1 = __importDefault(require("./SerializerValidation"));
const bigi_1 = __importDefault(require("bigi"));
// _internal is for low-level transaction code
const _internal = {
    // Warning: Long operations may over-flow without detection
    to_long64(number_or_string, precision, error_info = "") {
        SerializerValidation_1.default.required(number_or_string, "number_or_string " + error_info);
        SerializerValidation_1.default.required(precision, "precision " + error_info);
        return SerializerValidation_1.default.to_long(_internal.decimal_precision_string(number_or_string, precision, error_info));
    },
    decimal_precision_string(number, precision, error_info = "") {
        SerializerValidation_1.default.required(number, "number " + error_info);
        SerializerValidation_1.default.required(precision, "precision " + error_info);
        var number_string = SerializerValidation_1.default.to_string(number);
        number_string = number_string.trim();
        precision = SerializerValidation_1.default.to_number(precision);
        // remove leading zeros (not suffixing)
        var number_parts = number_string.match(/^-?0*([0-9]*)\.?([0-9]*)$/);
        if (!number_parts) {
            throw new Error(`Invalid number: ${number_string} ${error_info}`);
        }
        var sign = number_string.charAt(0) === "-" ? "-" : "";
        var int_part = number_parts[1];
        var decimal_part = number_parts[2];
        if (!decimal_part) {
            decimal_part = "";
        }
        // remove trailing zeros
        while (/0$/.test(decimal_part)) {
            decimal_part = decimal_part.substring(0, decimal_part.length - 1);
        }
        var zero_pad_count = precision - decimal_part.length;
        if (zero_pad_count < 0) {
            throw new Error(`overflow, up to ${precision} decimals may be used ${error_info}`);
        }
        if (sign === "-" && !/[1-9]/.test(int_part + decimal_part)) {
            sign = "";
        }
        if (int_part === "") {
            int_part = "0";
        }
        for (var i = 0; 0 < zero_pad_count ? i < zero_pad_count : i > zero_pad_count; 0 < zero_pad_count ? i++ : i++) {
            decimal_part += "0";
        }
        return sign + int_part + decimal_part;
    }
};
_my = {
    // Result may be used for int64 types (like transfer amount).  Asset's
    // precision is used to convert the number to a whole number with an implied
    // decimal place.
    // "1.01" with a precision of 2 returns long 101
    // See http://cryptocoinjs.com/modules/misc/bigi/#example
    to_bigint64(number_or_string, precision, error_info = "") {
        var long = _internal.to_long64(number_or_string, precision, error_info);
        return bigi_1.default(long.toString());
    },
    // 101 string or long with a precision of 2 returns "1.01"
    to_string64(number_or_string, precision, error_info = "") {
        SerializerValidation_1.default.required(number_or_string, error_info);
        SerializerValidation_1.default.number(precision);
        var number_long = SerializerValidation_1.default.to_long(number_or_string, error_info);
        var string64 = _internal.decimal_precision_string(number_long, precision, error_info);
        SerializerValidation_1.default.no_overflow64(string64, error_info);
        return string64;
    },
    _internal
};
exports.default = _my;
